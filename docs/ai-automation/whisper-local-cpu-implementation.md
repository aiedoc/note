# Whisperローカル実装完全ガイド：CPUオンリーで実現する高精度音声認識

![Badge](https://img.shields.io/badge/AI%E9%96%8B%E7%99%BA-Whisper%E3%83%AD%E3%83%BC%E3%82%AB%E3%83%AB-orange.svg)

## 実現できること

<div class="grid cards" markdown>

-   :material-shield-lock: **完全プライベート処理**
    
    オープンソースのWhisperをローカル環境で実行、機密情報の漏洩ゼロ

-   :material-cpu-64-bit: **CPU専用高速化**
    
    faster-whisperでGPU不要、オリジナルより4倍高速な処理

-   :material-microsoft-windows: **Windows統合**
    
    Win+H音声入力との連携で既存ワークフローに自然統合

-   :material-speedometer: **リアルタイム処理**
    
    2025年最新のlarge-v3-turboで3倍高速、実用レベルの応答速度

</div>

## 📖 Overview

2025年、OpenAI Whisperのローカル実装は革命的な進化を遂げています。従来GPUが必須だった高精度音声認識が、CPUオンリーで実用レベルに到達しました。

特に注目すべきは「faster-whisper」と「large-v3-turbo」モデルの登場です。これらの技術により、プライバシーを完全に保護しながら、商用レベルの音声認識をローカル環境で実現できます。

本記事では、Whisperをローカル環境でCPU処理により実装し、Windows標準の音声入力機能と連携させる完全な手順を解説します。

## 🔧 Implementation

### Step 1: 環境構築

#### Python環境の準備

```bash
# Python仮想環境の作成
python -m venv whisper-local
whisper-local\Scripts\activate.bat  # Windows

# 必要パッケージのインストール
pip install faster-whisper
pip install numpy==1.26.4  # 互換性確保
pip install pyaudio
pip install keyboard  # キーボードフック用
pip install pywin32   # Windows API用
```

#### FFmpegのインストール

```bash
# Chocolateyを使用（推奨）
choco install ffmpeg

# または手動インストール
# 1. https://github.com/BtbN/FFmpeg-Builds/releases からダウンロード
# 2. C:\ffmpeg に展開
# 3. 環境変数Pathに C:\ffmpeg\bin を追加
```

### Step 2: Whisperローカル実装の基本

#### 基本的な音声認識

```python
# whisper_basic.py
from faster_whisper import WhisperModel
import warnings
warnings.filterwarnings("ignore")

class LocalWhisper:
    def __init__(self, model_size="base", device="cpu", compute_type="int8"):
        """
        Whisperモデルの初期化
        
        Args:
            model_size: "tiny", "base", "small", "medium", "large-v3", "large-v3-turbo"
            device: "cpu" (GPU不使用)
            compute_type: "int8" (CPU最適化)
        """
        print(f"Whisperモデル読み込み中: {model_size}")
        self.model = WhisperModel(
            model_size, 
            device=device, 
            compute_type=compute_type,
            cpu_threads=4  # CPUコア数に応じて調整
        )
        print("モデル読み込み完了")
    
    def transcribe_file(self, audio_path, language="ja"):
        """音声ファイルの文字起こし"""
        try:
            segments, info = self.model.transcribe(
                audio_path,
                language=language,
                beam_size=1,  # CPU処理時は1が最適
                temperature=0.0,
                vad_filter=True,  # 無音部分除去
                vad_parameters=dict(
                    min_silence_duration_ms=1000,
                    speech_pad_ms=400
                )
            )
            
            # 結果をテキストとして結合
            text = ""
            for segment in segments:
                text += segment.text
            
            return text.strip()
            
        except Exception as e:
            print(f"エラー: {e}")
            return None

# 使用例
if __name__ == "__main__":
    whisper = LocalWhisper(model_size="base")
    result = whisper.transcribe_file("test_audio.wav")
    print(f"認識結果: {result}")
```

#### リアルタイム音声認識

```python
# whisper_realtime.py
import pyaudio
import wave
import threading
import queue
import time
from faster_whisper import WhisperModel

class RealtimeWhisper:
    def __init__(self, model_size="base"):
        # 音声設定
        self.CHUNK = 1024
        self.FORMAT = pyaudio.paInt16
        self.CHANNELS = 1
        self.RATE = 16000
        self.RECORD_SECONDS = 3  # 3秒チャンクで処理
        
        # Whisperモデル
        self.model = WhisperModel(model_size, device="cpu", compute_type="int8")
        
        # PyAudio初期化
        self.audio = pyaudio.PyAudio()
        
        # キューとフラグ
        self.audio_queue = queue.Queue()
        self.is_recording = False
        
    def record_audio(self):
        """音声録音スレッド"""
        stream = self.audio.open(
            format=self.FORMAT,
            channels=self.CHANNELS,
            rate=self.RATE,
            input=True,
            frames_per_buffer=self.CHUNK
        )
        
        print("録音開始... (Ctrl+Cで停止)")
        
        while self.is_recording:
            frames = []
            for _ in range(int(self.RATE / self.CHUNK * self.RECORD_SECONDS)):
                if not self.is_recording:
                    break
                data = stream.read(self.CHUNK)
                frames.append(data)
            
            if frames:
                # 音声データをキューに追加
                audio_data = b''.join(frames)
                self.audio_queue.put(audio_data)
        
        stream.stop_stream()
        stream.close()
    
    def process_audio(self):
        """音声処理スレッド"""
        while self.is_recording:
            try:
                # キューから音声データ取得（タイムアウト付き）
                audio_data = self.audio_queue.get(timeout=1)
                
                # 一時ファイルに保存
                temp_file = "temp_audio.wav"
                with wave.open(temp_file, 'wb') as wf:
                    wf.setnchannels(self.CHANNELS)
                    wf.setsampwidth(self.audio.get_sample_size(self.FORMAT))
                    wf.setframerate(self.RATE)
                    wf.writeframes(audio_data)
                
                # Whisperで認識
                segments, _ = self.model.transcribe(
                    temp_file,
                    language="ja",
                    beam_size=1,
                    vad_filter=True
                )
                
                # 結果出力
                text = ""
                for segment in segments:
                    text += segment.text
                
                if text.strip():
                    print(f"認識結果: {text.strip()}")
                
            except queue.Empty:
                continue
            except Exception as e:
                print(f"処理エラー: {e}")
    
    def start(self):
        """リアルタイム認識開始"""
        self.is_recording = True
        
        # 録音と処理を並列実行
        record_thread = threading.Thread(target=self.record_audio)
        process_thread = threading.Thread(target=self.process_audio)
        
        record_thread.start()
        process_thread.start()
        
        try:
            record_thread.join()
            process_thread.join()
        except KeyboardInterrupt:
            print("\n停止中...")
            self.is_recording = False
        
    def __del__(self):
        if hasattr(self, 'audio'):
            self.audio.terminate()

# 使用例
if __name__ == "__main__":
    whisper_rt = RealtimeWhisper(model_size="base")
    whisper_rt.start()
```

### Step 3: Windows音声入力統合

#### Win+Hフック実装

```python
# windows_voice_integration.py
import keyboard
import time
import subprocess
import win32clipboard
import win32con
from faster_whisper import WhisperModel
import pyaudio
import wave
import threading

class WindowsVoiceIntegration:
    def __init__(self, model_size="base"):
        self.whisper = WhisperModel(model_size, device="cpu", compute_type="int8")
        self.is_recording = False
        self.audio_config = {
            'chunk': 1024,
            'format': pyaudio.paInt16,
            'channels': 1,
            'rate': 16000
        }
        self.audio = pyaudio.PyAudio()
        
        print("Windows音声入力統合システム初期化完了")
        print("使用方法:")
        print("  Ctrl+Shift+V: カスタム音声入力開始")
        print("  Win+H: 標準音声入力（置き換え）")
    
    def record_and_transcribe(self, duration=5):
        """音声録音と文字起こし"""
        print("録音開始...")
        
        stream = self.audio.open(
            format=self.audio_config['format'],
            channels=self.audio_config['channels'],
            rate=self.audio_config['rate'],
            input=True,
            frames_per_buffer=self.audio_config['chunk']
        )
        
        frames = []
        for _ in range(int(self.audio_config['rate'] / self.audio_config['chunk'] * duration)):
            data = stream.read(self.audio_config['chunk'])
            frames.append(data)
        
        stream.stop_stream()
        stream.close()
        
        # WAVファイルに保存
        temp_file = "voice_input.wav"
        with wave.open(temp_file, 'wb') as wf:
            wf.setnchannels(self.audio_config['channels'])
            wf.setsampwidth(self.audio.get_sample_size(self.audio_config['format']))
            wf.setframerate(self.audio_config['rate'])
            wf.writeframes(b''.join(frames))
        
        print("音声認識中...")
        
        # Whisperで文字起こし
        segments, _ = self.whisper.transcribe(
            temp_file,
            language="ja",
            beam_size=1,
            vad_filter=True,
            temperature=0.0
        )
        
        text = ""
        for segment in segments:
            text += segment.text
        
        return text.strip()
    
    def set_clipboard_text(self, text):
        """クリップボードにテキスト設定"""
        win32clipboard.OpenClipboard()
        win32clipboard.EmptyClipboard()
        win32clipboard.SetClipboardText(text, win32con.CF_UNICODETEXT)
        win32clipboard.CloseClipboard()
    
    def simulate_paste(self):
        """Ctrl+Vでペースト実行"""
        time.sleep(0.1)
        keyboard.send('ctrl+v')
    
    def custom_voice_input(self):
        """カスタム音声入力処理"""
        try:
            text = self.record_and_transcribe(duration=5)
            if text:
                print(f"認識結果: {text}")
                self.set_clipboard_text(text)
                self.simulate_paste()
                print("テキスト入力完了")
            else:
                print("音声を認識できませんでした")
        except Exception as e:
            print(f"エラー: {e}")
    
    def windows_h_hook(self):
        """Win+H置き換え処理"""
        # 標準のWin+Hを無効化し、カスタム処理を実行
        print("Win+H が押されました - カスタム音声入力を開始")
        self.custom_voice_input()
    
    def start_monitoring(self):
        """キーボード監視開始"""
        print("キーボード監視開始...")
        
        # カスタムホットキー: Ctrl+Shift+V
        keyboard.add_hotkey('ctrl+shift+v', self.custom_voice_input)
        
        # Win+H置き換え（注意: 管理者権限が必要）
        try:
            keyboard.add_hotkey('win+h', self.windows_h_hook)
            print("Win+H フック設定完了")
        except:
            print("Win+H フック設定失敗（管理者権限が必要）")
            print("代替: Ctrl+Shift+V を使用してください")
        
        print("監視中... (Ctrl+C で終了)")
        keyboard.wait()

# 使用例
if __name__ == "__main__":
    try:
        integration = WindowsVoiceIntegration(model_size="base")
        integration.start_monitoring()
    except KeyboardInterrupt:
        print("\nシステム終了")
```

### Step 4: 最適化とパフォーマンス調整

#### CPU最適化設定

```python
# performance_optimizer.py
import os
import psutil
from faster_whisper import WhisperModel

class WhisperOptimizer:
    def __init__(self):
        self.cpu_count = psutil.cpu_count()
        self.memory_gb = psutil.virtual_memory().total / (1024**3)
        
    def get_optimal_settings(self):
        """システムに最適な設定を提案"""
        
        # CPUコア数に基づくスレッド数
        if self.cpu_count >= 8:
            cpu_threads = 6
            model_size = "medium"
        elif self.cpu_count >= 4:
            cpu_threads = 4
            model_size = "base"
        else:
            cpu_threads = 2
            model_size = "tiny"
        
        # メモリに基づくモデル選択
        if self.memory_gb < 4:
            model_size = "tiny"
            compute_type = "int8"
        elif self.memory_gb < 8:
            model_size = "base"
            compute_type = "int8"
        else:
            compute_type = "float16"
        
        return {
            'model_size': model_size,
            'cpu_threads': cpu_threads,
            'compute_type': compute_type,
            'beam_size': 1,  # CPU処理時は1が最適
            'batch_size': 1
        }
    
    def create_optimized_model(self):
        """最適化されたWhisperモデルを作成"""
        settings = self.get_optimal_settings()
        
        print(f"システム情報:")
        print(f"  CPU: {self.cpu_count}コア")
        print(f"  メモリ: {self.memory_gb:.1f}GB")
        print(f"推奨設定:")
        print(f"  モデル: {settings['model_size']}")
        print(f"  スレッド: {settings['cpu_threads']}")
        print(f"  計算タイプ: {settings['compute_type']}")
        
        return WhisperModel(
            settings['model_size'],
            device="cpu",
            compute_type=settings['compute_type'],
            cpu_threads=settings['cpu_threads']
        ), settings

# ベンチマークテスト
def benchmark_models():
    """各モデルの性能テスト"""
    import time
    
    models = ["tiny", "base", "small"]
    test_file = "test_audio.wav"  # テスト用音声ファイル
    
    for model_name in models:
        print(f"\n{model_name}モデルテスト中...")
        
        start_time = time.time()
        model = WhisperModel(model_name, device="cpu", compute_type="int8")
        load_time = time.time() - start_time
        
        start_time = time.time()
        segments, _ = model.transcribe(test_file, beam_size=1)
        transcribe_time = time.time() - start_time
        
        print(f"  読み込み時間: {load_time:.2f}秒")
        print(f"  認識時間: {transcribe_time:.2f}秒")

if __name__ == "__main__":
    optimizer = WhisperOptimizer()
    model, settings = optimizer.create_optimized_model()
    print("\n最適化モデル作成完了")
```

## 💡 Best Practices

### 1. モデル選択の指針

**tiny (39MB)**:
- 用途: リアルタイム処理、低スペックPC
- 精度: 基本レベル（会話の大まかな内容把握）
- 速度: 最高速（実時間の0.1倍）

**base (74MB)**:
- 用途: 一般的な音声認識、バランス重視
- 精度: 実用レベル（日常会話、会議録音）
- 速度: 高速（実時間の0.16倍）

**large-v3-turbo (809MB)**:
- 用途: 高精度が必要な文字起こし
- 精度: 最高レベル（94%の日本語認識精度）
- 速度: medium相当の速度でlarge相当の精度

### 2. CPU最適化テクニック

```python
# CPU最適化の実装例
import os

# OpenMPスレッド数を制限（CPUコア数の75%）
os.environ["OMP_NUM_THREADS"] = str(max(1, psutil.cpu_count() * 3 // 4))

# NumPyのスレッド数制限
os.environ["OPENBLAS_NUM_THREADS"] = "1"
os.environ["MKL_NUM_THREADS"] = "1"

# faster-whisperの最適設定
model = WhisperModel(
    "base",
    device="cpu",
    compute_type="int8",  # メモリ使用量削減
    cpu_threads=4,       # CPUコア数に応じて調整
    num_workers=1        # 並列処理数
)
```

### 3. メモリ使用量削減

```python
# メモリ効率化の設定
def create_memory_efficient_model():
    return WhisperModel(
        "base",
        device="cpu",
        compute_type="int8",      # FP16→INT8で大幅削減
        download_root="./models", # モデル保存場所指定
        local_files_only=False
    )

# ガベージコレクション明示的実行
import gc
gc.collect()
```

## 🚀 Advanced Usage

### プログラマブル音声コマンド

```python
# voice_commands.py
import re
from faster_whisper import WhisperModel

class VoiceCommandProcessor:
    def __init__(self):
        self.model = WhisperModel("base", device="cpu", compute_type="int8")
        self.commands = {
            r"ファイルを開く": self.open_file,
            r"新しいファイル": self.new_file,
            r"保存": self.save_file,
            r"コピー": self.copy_text,
            r"ペースト": self.paste_text,
            r"検索.*": self.search_text
        }
    
    def process_command(self, audio_file):
        """音声コマンドの処理"""
        # 音声認識
        segments, _ = self.model.transcribe(audio_file, language="ja")
        text = "".join([segment.text for segment in segments]).strip()
        
        print(f"認識されたコマンド: {text}")
        
        # コマンドマッチング
        for pattern, action in self.commands.items():
            if re.match(pattern, text):
                action(text)
                return True
        
        # コマンドが見つからない場合はテキスト入力
        self.input_text(text)
        return False
    
    def open_file(self, text):
        print("ファイルを開きます")
        keyboard.send('ctrl+o')
    
    def new_file(self, text):
        print("新しいファイルを作成します")
        keyboard.send('ctrl+n')
    
    def save_file(self, text):
        print("ファイルを保存します")
        keyboard.send('ctrl+s')
    
    def copy_text(self, text):
        print("テキストをコピーします")
        keyboard.send('ctrl+c')
    
    def paste_text(self, text):
        print("テキストをペーストします")
        keyboard.send('ctrl+v')
    
    def search_text(self, text):
        # "検索 キーワード" からキーワードを抽出
        keyword = text.replace("検索", "").strip()
        print(f"'{keyword}'を検索します")
        keyboard.send('ctrl+f')
        time.sleep(0.1)
        keyboard.write(keyword)
    
    def input_text(self, text):
        """通常のテキスト入力"""
        print(f"テキスト入力: {text}")
        keyboard.write(text)
```

### バッチ処理と自動化

```python
# batch_processor.py
import os
import glob
from concurrent.futures import ThreadPoolExecutor
from faster_whisper import WhisperModel

class BatchWhisperProcessor:
    def __init__(self, model_size="base", max_workers=2):
        self.model = WhisperModel(model_size, device="cpu", compute_type="int8")
        self.max_workers = max_workers
    
    def process_file(self, audio_file):
        """単一ファイルの処理"""
        try:
            print(f"処理中: {audio_file}")
            segments, info = self.model.transcribe(
                audio_file,
                language="ja",
                beam_size=1,
                vad_filter=True
            )
            
            # 結果をテキストファイルに保存
            text = "".join([segment.text for segment in segments])
            output_file = os.path.splitext(audio_file)[0] + "_transcript.txt"
            
            with open(output_file, 'w', encoding='utf-8') as f:
                f.write(text)
            
            print(f"完了: {output_file}")
            return output_file
            
        except Exception as e:
            print(f"エラー ({audio_file}): {e}")
            return None
    
    def process_directory(self, directory, pattern="*.wav"):
        """ディレクトリ内の音声ファイルを一括処理"""
        audio_files = glob.glob(os.path.join(directory, pattern))
        print(f"処理対象: {len(audio_files)}ファイル")
        
        with ThreadPoolExecutor(max_workers=self.max_workers) as executor:
            results = list(executor.map(self.process_file, audio_files))
        
        successful = [r for r in results if r is not None]
        print(f"処理完了: {len(successful)}/{len(audio_files)}ファイル")
        
        return successful

# 使用例
if __name__ == "__main__":
    processor = BatchWhisperProcessor(model_size="base", max_workers=2)
    processor.process_directory("./audio_files", "*.wav")
```

## ⚠️ Troubleshooting

### よくある問題と解決策

**問題1: NumPy互換性エラー**
```bash
# 解決策
pip uninstall numpy
pip install numpy==1.26.4
```

**問題2: FFmpeg not found**
```bash
# Windows環境での解決
# 1. FFmpegバイナリをダウンロード
# 2. 環境変数Pathに追加
# 3. コマンドプロンプトで確認
ffmpeg -version
```

**問題3: メモリ不足エラー**
```python
# 軽量モデルに変更
model = WhisperModel("tiny", device="cpu", compute_type="int8")

# または処理チャンクサイズを調整
segments, _ = model.transcribe(
    audio_file,
    beam_size=1,  # ビームサイズを1に
    best_of=1     # ベスト候補数を1に
)
```

**問題4: 認識精度の低下**
```python
# VADフィルターの調整
segments, _ = model.transcribe(
    audio_file,
    vad_filter=True,
    vad_parameters=dict(
        min_silence_duration_ms=500,  # 無音判定を短く
        speech_pad_ms=200            # 音声パディングを調整
    )
)
```

### パフォーマンス改善

```python
# performance_tips.py

# 1. プロセス優先度の設定
import psutil
import os

process = psutil.Process(os.getpid())
process.nice(psutil.HIGH_PRIORITY_CLASS)  # Windows

# 2. CPUアフィニティの設定
cpu_count = psutil.cpu_count()
if cpu_count > 4:
    # 物理コアのみ使用（ハイパースレッドを避ける）
    process.cpu_affinity(list(range(0, cpu_count//2)))

# 3. メモリ使用量監視
def monitor_memory_usage():
    memory = psutil.virtual_memory()
    print(f"メモリ使用率: {memory.percent}%")
    if memory.percent > 85:
        print("警告: メモリ使用量が高すぎます")
```

## 🔗 Related Articles

- [音声入力プログラミング革命2025](./voice-input-programming-2025.md)
- [Claude Codeによるプロジェクト管理の可能性](./claude-code-project-management.md)
- [AI開発環境の構築とベストプラクティス](./ai-development-environment.md)

---