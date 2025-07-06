# Claude Code 画像・コード連携 - ビジュアル駆動開発

![Image Integration](https://img.shields.io/badge/Image%20Integration-Visual%20Driven-pink.svg)

## 実現できること

<div class="grid cards" markdown>

-   :material-image-frame: **モックからコードへ**
    
    デザインモックから直接HTMLやCSSを生成

-   :material-camera: **スクリーンショット分析**
    
    UIの問題点を自動検出し修正提案

-   :material-chart-box: **データ可視化**
    
    グラフやチャートの自動生成と最適化

-   :material-responsive: **レスポンシブ対応**
    
    複数デバイスでの表示確認と調整

</div>

## 📖 画像連携の基本概念

Claude Code は画像を理解し、ビジュアル情報とコードを連携させることができます。デザインモックからの実装、UI/UXの問題検出、データ可視化の改善など、視覚的な情報を活用した開発を支援します。

### 対応する画像形式

- **PNG**: スクリーンショット、モックアップ
- **JPG**: 写真、UI デザイン
- **SVG**: アイコン、ベクター画像
- **WebP**: 最適化された画像

## 🎨 デザインモックからの実装

### 1. 基本的なモック実装

```bash
# デザインファイルをドラッグ&ドロップ
claude
> このデザインモックを HTML/CSS で実装してください

# または、ファイルパスを指定
claude
> /path/to/mockup.png を元に React コンポーネントを作成してください
```

### 2. 詳細な実装指示

```bash
claude
> このモックアップを実装してください：

要件：
- React + TypeScript
- Material-UI コンポーネント
- レスポンシブデザイン
- アクセシビリティ対応
- ダークモード対応

技術仕様：
- CSS-in-JS (emotion)
- Grid Layout
- Flexbox
- CSS Variables
```

### 3. 段階的な実装

```bash
# Phase 1: レイアウト構造
claude
> まずはこのモックの基本レイアウトを作成してください

# Phase 2: スタイリング
claude
> 前回作成したレイアウトに、モックに合わせたスタイルを適用してください

# Phase 3: インタラクション
claude
> ボタンやフォームの動作を追加してください
```

## 🔧 実装例

### 1. ランディングページの実装

```tsx
// 生成されたコンポーネント例
import React from 'react';
import { Box, Typography, Button, Container, Grid, Card, CardContent } from '@mui/material';
import { styled } from '@mui/material/styles';

const HeroSection = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: 'white',
  padding: theme.spacing(8, 0),
  textAlign: 'center',
  minHeight: '60vh',
  display: 'flex',
  alignItems: 'center',
}));

const FeatureCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
  },
}));

const LandingPage: React.FC = () => {
  return (
    <Box>
      {/* Hero Section */}
      <HeroSection>
        <Container maxWidth="lg">
          <Typography variant="h2" component="h1" gutterBottom>
            革新的なソリューション
          </Typography>
          <Typography variant="h5" component="p" gutterBottom>
            あなたのビジネスを次のレベルへ
          </Typography>
          <Button
            variant="contained"
            size="large"
            sx={{
              mt: 3,
              px: 4,
              py: 1.5,
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(10px)',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.3)',
              },
            }}
          >
            今すぐ始める
          </Button>
        </Container>
      </HeroSection>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h3" component="h2" textAlign="center" gutterBottom>
          主な機能
        </Typography>
        <Grid container spacing={4} sx={{ mt: 2 }}>
          {[
            { title: '高速処理', description: '最新技術による高速な処理能力' },
            { title: '簡単操作', description: '直感的なユーザーインターフェース' },
            { title: '安全性', description: '企業レベルのセキュリティ機能' },
          ].map((feature, index) => (
            <Grid item xs={12} md={4} key={index}>
              <FeatureCard>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h5" component="h3" gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </FeatureCard>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default LandingPage;
```

### 2. フォームコンポーネントの実装

```tsx
// 画像から生成されたフォーム
import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from '@mui/material';
import { styled } from '@mui/material/styles';

const FormContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  maxWidth: 600,
  margin: '0 auto',
  borderRadius: theme.spacing(2),
  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
}));

const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    category: '',
    message: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value,
    }));
    
    // リアルタイムバリデーション
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'お名前を入力してください';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'メールアドレスを入力してください';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = '有効なメールアドレスを入力してください';
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'メッセージを入力してください';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    
    if (validateForm()) {
      console.log('Form submitted:', formData);
      // API 送信処理
    }
  };

  return (
    <FormContainer>
      <Typography variant="h4" component="h1" gutterBottom textAlign="center">
        お問い合わせ
      </Typography>
      <Typography variant="body1" color="text.secondary" gutterBottom textAlign="center">
        お気軽にお問い合わせください
      </Typography>
      
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="お名前"
              value={formData.name}
              onChange={handleChange('name')}
              error={!!errors.name}
              helperText={errors.name}
              required
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="メールアドレス"
              type="email"
              value={formData.email}
              onChange={handleChange('email')}
              error={!!errors.email}
              helperText={errors.email}
              required
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="会社名"
              value={formData.company}
              onChange={handleChange('company')}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>お問い合わせ種別</InputLabel>
              <Select
                value={formData.category}
                onChange={handleChange('category')}
                label="お問い合わせ種別"
              >
                <MenuItem value="general">一般的なお問い合わせ</MenuItem>
                <MenuItem value="support">サポート</MenuItem>
                <MenuItem value="sales">営業</MenuItem>
                <MenuItem value="partnership">パートナーシップ</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="メッセージ"
              multiline
              rows={4}
              value={formData.message}
              onChange={handleChange('message')}
              error={!!errors.message}
              helperText={errors.message}
              required
            />
          </Grid>
          
          <Grid item xs={12}>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              sx={{
                py: 1.5,
                background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #FE6B8B 60%, #FF8E53 100%)',
                },
              }}
            >
              送信する
            </Button>
          </Grid>
        </Grid>
      </Box>
    </FormContainer>
  );
};

export default ContactForm;
```

## 📱 レスポンシブ対応

### 1. マルチデバイス対応

```bash
claude
> このデザインをレスポンシブ対応してください

デバイス要件：
- デスクトップ: 1200px以上
- タブレット: 768px-1199px
- スマートフォン: 767px以下

調整点：
- ナビゲーションメニューをハンバーガーメニューに変更
- カードレイアウトを縦並びに変更
- フォントサイズの調整
- 余白の最適化
```

### 2. 画像最適化

```tsx
// 自動生成されたレスポンシブ画像コンポーネント
import React from 'react';
import { Box, useTheme, useMediaQuery } from '@mui/material';

interface ResponsiveImageProps {
  src: string;
  alt: string;
  priority?: boolean;
}

const ResponsiveImage: React.FC<ResponsiveImageProps> = ({ src, alt, priority = false }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  return (
    <Box
      component="img"
      src={src}
      alt={alt}
      loading={priority ? 'eager' : 'lazy'}
      sx={{
        width: '100%',
        height: 'auto',
        maxWidth: {
          xs: '100%',
          sm: '500px',
          md: '700px',
          lg: '900px',
        },
        borderRadius: 2,
        objectFit: 'cover',
        transition: 'transform 0.3s ease-in-out',
        '&:hover': {
          transform: 'scale(1.02)',
        },
      }}
    />
  );
};

export default ResponsiveImage;
```

## 🔍 UI/UX 問題の自動検出

### 1. アクセシビリティチェック

```bash
claude
> このUIのスクリーンショットを分析してアクセシビリティの問題を検出してください

チェック項目：
- カラーコントラスト
- フォントサイズ
- ボタンのクリック領域
- キーボードナビゲーション
- スクリーンリーダー対応
```

### 2. ユーザビリティ評価

```bash
claude
> このUIデザインのユーザビリティを評価してください

評価観点：
- 情報の階層構造
- 視線の流れ
- CTAボタンの配置
- フォームの使いやすさ
- エラーメッセージの表示
```

## 📊 データ可視化

### 1. チャートの自動生成

```tsx
// 画像から生成されたチャートコンポーネント
import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { Box, Typography, Paper, Grid } from '@mui/material';

const data = [
  { name: 'Jan', value: 4000, growth: 2400 },
  { name: 'Feb', value: 3000, growth: 1398 },
  { name: 'Mar', value: 2000, growth: 9800 },
  { name: 'Apr', value: 2780, growth: 3908 },
  { name: 'May', value: 1890, growth: 4800 },
  { name: 'Jun', value: 2390, growth: 3800 },
];

const pieData = [
  { name: 'デスクトップ', value: 45, color: '#0088FE' },
  { name: 'モバイル', value: 35, color: '#00C49F' },
  { name: 'タブレット', value: 20, color: '#FFBB28' },
];

const DashboardCharts: React.FC = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        売上ダッシュボード
      </Typography>
      
      <Grid container spacing={3}>
        {/* 売上推移 */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2, height: 400 }}>
            <Typography variant="h6" gutterBottom>
              売上推移
            </Typography>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#8884d8" 
                  strokeWidth={2}
                  dot={{ fill: '#8884d8', strokeWidth: 2, r: 4 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="growth" 
                  stroke="#82ca9d" 
                  strokeWidth={2}
                  dot={{ fill: '#82ca9d', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
        
        {/* デバイス別比率 */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, height: 400 }}>
            <Typography variant="h6" gutterBottom>
              デバイス別アクセス
            </Typography>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
        
        {/* 月別比較 */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2, height: 300 }}>
            <Typography variant="h6" gutterBottom>
              月別売上比較
            </Typography>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardCharts;
```

## 🎯 高度な活用例

### 1. A/Bテスト用バリアント生成

```bash
claude
> この既存のランディングページに対して、A/Bテスト用のバリアントを3つ作成してください

テスト要素：
- ヘッダーのキャッチコピー
- CTAボタンの色とテキスト
- 画像の配置
- フォームの項目数

測定指標：
- コンバージョン率
- 直帰率
- エンゲージメント率
```

### 2. 競合分析

```bash
claude
> 競合他社のウェブサイトのスクリーンショットを分析して、改善提案をしてください

分析項目：
- レイアウトの特徴
- 色使い
- フォントの選択
- ナビゲーション構造
- CTAの配置
- 差別化ポイント
```

## 🛠️ 自動化ワークフロー

### 1. デザインからコードへの自動変換

```bash
#!/bin/bash
# design_to_code.sh

# デザインファイルの監視
inotifywait -m -e create --format '%w%f' /path/to/design/folder | while read file; do
    if [[ "$file" =~ \.(png|jpg|jpeg)$ ]]; then
        echo "New design file detected: $file"
        
        # Claude Code で自動変換
        claude -p "Convert this design to a React component" < "$file" > "generated/$(basename "$file" .png).tsx"
        
        echo "Generated component: generated/$(basename "$file" .png).tsx"
    fi
done
```

### 2. レスポンシブテストの自動化

```javascript
// responsive_test.js
const puppeteer = require('puppeteer');

const devices = [
  { name: 'Desktop', width: 1920, height: 1080 },
  { name: 'Tablet', width: 768, height: 1024 },
  { name: 'Mobile', width: 375, height: 667 },
];

async function captureScreenshots(url) {
  const browser = await puppeteer.launch();
  
  for (const device of devices) {
    const page = await browser.newPage();
    await page.setViewport({ width: device.width, height: device.height });
    await page.goto(url);
    
    const screenshot = await page.screenshot({
      path: `screenshots/${device.name.toLowerCase()}.png`,
      fullPage: true,
    });
    
    console.log(`Screenshot captured for ${device.name}`);
    await page.close();
  }
  
  await browser.close();
}

// Claude Code で分析
async function analyzeResponsive() {
  const claude = require('claude-code');
  
  for (const device of devices) {
    const result = await claude.analyze(`screenshots/${device.name.toLowerCase()}.png`, {
      prompt: `Analyze this ${device.name} screenshot for responsive design issues`,
    });
    
    console.log(`${device.name} Analysis:`, result);
  }
}

captureScreenshots('http://localhost:3000').then(() => {
  analyzeResponsive();
});
```

## 📈 効果測定

### 導入効果の例

| 指標 | 改善結果 |
|------|----------|
| 実装速度 | 5倍高速化 |
| デザイン品質 | 一貫性 95% 向上 |
| アクセシビリティ | WCAG準拠 100% 達成 |
| レスポンシブ対応 | 全デバイス対応 100% |

## 🔗 関連記事

- [Claude Code 応用編完全ガイド](./claude-code-advanced-guide.md)
- [Hooks活用術](./claude-code-hooks-advanced.md)
- [バッチ処理マスター](./claude-code-batch-processing.md)
- [GitHub Actions自動化](./claude-code-github-actions.md)

---

*最終更新: 2025-07-05*