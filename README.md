# Local Lingua

Local Lingua is a website designed for travelers who seek a deeper cultural experience through language. Created by passionate third-year Tourism students at National University Baliwag, the website provides foundational language skills through real-life interactions with native speakers and offers specialized options for tourists who want a tour guide who can translate and serve as their driver.

## Features

- **Language Learning**: Engage in conversational practice integrated into each itinerary.
- **Tour Guide Services**: Hire tour guides who can translate and drive.
- **Cultural Immersion**: Experience local culture through language and interactions with native speakers.
- **User Profiles**: Manage your profile, update information, and change passwords.
- **Activity Management**: Admins can manage activities, including uploading images and descriptions.
- **Location Management**: Admins can manage locations, including uploading images and descriptions.

## Technologies Used

- **Frontend**: React, Tailwind CSS
- **Backend**: Firebase Firestore, Supabase Storage
- **Authentication**: Firebase Auth
- **Hosting**: Vercel

## Getting Started

### Prerequisites

- Node.js
- npm

### Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/chewear/local-lingua.git
    cd local-lingua
    ```

2. Install dependencies:
    ```sh
    npm install
    ```

3. Create a `.env` file in the root directory and add your Firebase and Supabase configuration:
    ```env
    REACT_APP_FIREBASE_API_KEY=your_api_key
    REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
    REACT_APP_FIREBASE_PROJECT_ID=your_project_id
    REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
    REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
    REACT_APP_FIREBASE_APP_ID=your_app_id
    REACT_APP_SUPABASE_URL=your_supabase_url
    REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
    ```

4. Start the development server:
    ```sh
    npm start
    ```

## Usage

- **User Profile**: Update your personal information and change your password.
- **Admin Panel**: Manage activities and locations, including uploading images and descriptions.
- **Booking**: Book tours and language learning sessions with local guides.

## Contributing

Contributions are welcome! Please fork the repository and create a pull request with your changes.

## License

This project is licensed under the MIT License.

## Contact

For any inquiries, please contact us at [kurumitokisaki@gmail.com].