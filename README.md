# StockDaily

StockDaily is a web application designed to display stock data fetched from an external API, store them in MongoDB, and update them automatically every 5 seconds.

## Features

- Fetches stock data from an external API (coingecko).
- Persists fetched data in MongoDB.
- Updates displayed data automatically every 5 seconds.

## Technologies Used

- **Frontend**: React
- **Backend**: Node.js
- **Database**: MongoDB
- **Styling**: Tailwind CSS
- **API Integration**: Axios

## Getting Started

To get a local copy of this project up and running, follow these steps:

### Prerequisites

- Node.js installed on your machine
- MongoDB installed and running locally or a MongoDB Atlas account

### Installation

1. Clone the repository:

   ```bash
   git clone <repository_url>
   ```

2. Navigate into the project directory:

   ```bash
   cd StockDaily
   cd my-app
   ```

3. Install dependencies for both frontend and backend:

   ```bash
   npm install
   ```

4. Set up environment variables:

   - Create a `.env` file in the `server` directory and define the following variables:

     ```env
     PORT=3000
     MONGODB_URI=mongodb://localhost:27017/DailyStocks
     ```

5. Start the server:

   ```bash
   npm run dev
   ```

7. Open your browser and navigate to `http://localhost:3000/dashboard` to view the application.

## Usage

- Select a cryptocurrency from the modal to view its current price, market cap, and updated timestamp.
- Data updates automatically every 1 seconds to reflect the latest information.
- Click on the "Change Crypto" button to select a different cryptocurrency.

## Contributing

Contributions are welcome! If you find any issues or have suggestions for improvements, please create an issue or submit a pull request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
