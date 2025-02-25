# Inmate Alerts

A modern web application that provides real-time notifications about inmate bookings, releases, and status changes in Scott County, Iowa.

![Inmate Alerts](https://via.placeholder.com/1200x630/0a0a0a/ffffff?text=Inmate+Alerts)

## Overview

Inmate Alerts helps users stay informed about changes to inmate status in Scott County, Iowa. The application allows users to set up alerts for specific inmates and receive notifications via email or SMS when there are updates.

### Key Features

- **Real-time Notifications**: Get instant alerts about bookings, releases, and status changes
- **Customizable Alerts**: Track specific inmates by name
- **Multiple Notification Methods**: Choose between email, SMS, or both
- **User-friendly Dashboard**: Easily manage your alert preferences
- **Secure Authentication**: Powered by Amazon Cognito
- **Subscription Plans**: Free and paid tiers with different feature sets

## Technology Stack

- **Frontend**: Next.js, React, TailwindCSS
- **Backend**: AWS Amplify, AWS Lambda, DynamoDB
- **Authentication**: Amazon Cognito
- **Notifications**: Twilio (SMS), Resend (Email)
- **Payment Processing**: Stripe
- **Infrastructure**: AWS (DynamoDB, Lambda, SQS, EventBridge)

## Getting Started

### Prerequisites

- Node.js (v16 or later)
- npm or yarn
- AWS account
- Stripe account
- Twilio account
- Resend account

### Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```
# AWS Configuration
AWS_REGION=us-east-1
AWS_BRANCH=main

# Stripe Configuration
STRIPE_EVENTBUS_ID=your-stripe-eventbus-id
NEXT_PUBLIC_WATCHFUL_CITIZEN_MONTHLY_STRIPE_PRICE_ID=your-stripe-price-id

# Twilio Configuration
TWILIO_ACCOUNT_SID=your-twilio-account-sid
TWILIO_API_KEY=your-twilio-api-key
TWILIO_PHONE_NUMBER=your-twilio-phone-number
```

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/inmate-tracker.git
   cd inmate-tracker
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```

3. Initialize Amplify:

   ```bash
   amplify init
   ```

4. Push Amplify resources:

   ```bash
   amplify push
   ```

5. Start the development server:

   ```bash
   npm run dev
   # or
   yarn dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
inmate-tracker/
├── amplify/               # AWS Amplify configuration and resources
│   ├── auth/              # Authentication configuration
│   ├── data/              # Data models and schema
│   ├── functions/         # Lambda functions
│   │   ├── inmateCron/    # Scheduled job to fetch inmate data
│   │   ├── inmateDDBStream/ # Process DynamoDB stream events
│   │   ├── sendEmail/     # Email notification service
│   │   ├── sendMMS/       # SMS notification service
│   │   └── ...
├── app/                   # Next.js app directory
│   ├── my-account/        # User account management
│   ├── privacy/           # Privacy policy page
│   ├── terms/             # Terms of service page
│   └── ...
├── components/            # React components
│   ├── blocks/            # Larger component blocks
│   └── ui/                # UI components
├── public/                # Static assets
└── ...
```

## Architecture

The application uses a serverless architecture with AWS services:

1. **Data Collection**: A scheduled Lambda function (`inmateCron`) fetches inmate data from Scott County's public records.
2. **Data Storage**: Inmate information is stored in DynamoDB.
3. **Event Processing**: DynamoDB streams trigger the `inmateDDBStream` Lambda function when new inmates are added.
4. **Notification System**:
   - Email notifications are queued in SQS and processed by the `inmateQueuePoller` Lambda.
   - SMS notifications are sent directly via Twilio.
5. **Payment Processing**: Stripe integration for subscription management with EventBridge for event handling.

## AWS Services Used

- **DynamoDB**: Primary database for storing inmate and user data
- **Lambda**: Serverless functions for business logic
- **Cognito**: User authentication and management
- **SQS**: Message queuing for email notifications
- **EventBridge**: Event handling for Stripe events
- **CloudWatch**: Monitoring and logging

## Deployment

The application is deployed using AWS Amplify:

```bash
amplify publish
```

## Subscription Plans

The application offers different subscription tiers:

- **Free Tier**: Basic features with limited alerts
- **Paid Tier**: Advanced features with more alerts and notification options

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

For support or inquiries, please contact [support@focusotter.com](mailto:support@focusotter.com).

## Acknowledgements

- Scott County Sheriff's Office for providing public inmate data
- AWS for cloud infrastructure
- Stripe for payment processing
- Twilio for SMS capabilities
- Resend for email delivery
