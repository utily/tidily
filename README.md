# tidily

[![npm version](https://img.shields.io/npm/v/tidily.svg)](https://www.npmjs.com/package/tidily)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A TypeScript library for formatting strings during input and presentation, following ISO standards. Tidily provides robust handling for various data types including dates, numbers, phone numbers, credit cards, and more.

## Features

- 🎯 Type-safe formatting with TypeScript
- 🔄 Real-time input formatting
- 📅 Date formatting (DMY, MDY, YMD)
- 💳 Credit card number formatting
- 📞 Phone number formatting
- 💰 Price and currency formatting
- 📧 Email validation and formatting
- 🔢 Number formatting (integers, decimals, percentages)
- ⚡️ Zero dependencies (except isoly)
- 📦 Works in both ESM and CommonJS environments

## Installation

```bash
npm install tidily
```

## Usage

### Basic Example

```typescript
import { tidily } from "tidily"

// Format a credit card number during input
const formatted = tidily.format("4111111111111111", "card-number")
console.log(formatted) // "4111 1111 1111 1111"

// Format a date
const date = tidily.format("20250528", "date")
console.log(date) // "2025-05-28"
```

### Available Formatters

- `card-csc` - Card security code
- `card-expires` - Card expiration date
- `card-number` - Card number with spaces
- `date` - Date formatting (DMY/MDY/YMD)
- `date-time` - DateTime formatting
- `divisor` - Number divisor formatting
- `duration` - Time duration
- `email` - Email address
- `hex-color` - Hexadecimal color codes
- `identifier` - Custom identifiers
- `identity-number` - Identity numbers
- `integer` - Integer numbers
- `password` - Password input
- `percent` - Percentage values
- `phone` - Phone numbers
- `postal-code` - Postal/ZIP codes
- `price` - Price/currency values
- `text` - General text formatting

## API

### format(value: string, type: string, settings?: Settings): string

Formats a string value according to the specified type and optional settings.

### parse(value: string, type: string, settings?: Settings): any

Parses a formatted string back into its raw value.

### Type-specific Settings

Each formatter type can accept specific settings. For example:

```typescript
// Format a price with specific currency and locale
const price = tidily.format("1234.56", "price", {
	currency: "USD",
	locale: "en-US",
})
console.log(price) // "$1,234.56"
```

## Development

1. Clone the repository
2. Install dependencies: `npm install`
3. Build: `npm run build`
4. Test: `npm test`
5. Lint: `npm run lint`

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed development guidelines.

## License

[MIT](LICENSE) © Utily Contributors
