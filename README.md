# 🎓 Sorteos - Class Management & Winner Picker

A comprehensive React application designed for teachers to manage class attendance and pick winners from their student lists.

## ✨ Features

### 📱 QR Code Generator

- Generate QR codes from attendance form links
- Support for Google Forms, Microsoft Forms, and other form platforms
- Download QR codes as PNG images
- Easy sharing with students for attendance tracking

### 📊 Excel Upload

- Upload student lists from Excel files (.xlsx, .xls)
- Drag and drop file upload support
- Automatic detection of Name and Email columns
- Visual student list management
- Export student lists back to Excel
- Remove individual students or clear entire list

### 🎯 Winner Picker

- Pick random winners from your student list
- Select specific students for participation
- Animated winner selection process
- Confetti celebration effect
- Winner statistics and information display
- Option to pick multiple winners

## 🚀 Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. Clone or download the project
2. Navigate to the project directory:

   ```bash
   cd sorteos-app
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Start the development server:

   ```bash
   npm start
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📖 How to Use

### 1. QR Code Generation

1. Go to the "QR Code Generator" tab
2. Create an attendance form (Google Forms, Microsoft Forms, etc.)
3. Copy the form's URL
4. Paste it in the input field
5. The QR code will be generated automatically
6. Download the QR code and display it to your students

### 2. Student List Management

1. Go to the "Excel Upload" tab
2. Prepare an Excel file with columns: Name, Email (optional)
3. Drag and drop the file or click to browse
4. Review the imported student list
5. Make any necessary edits (remove students, etc.)
6. Export the list if needed

### 3. Winner Selection

1. Go to the "Winner Picker" tab
2. Select which students should participate (or leave all selected)
3. Click "Pick Winner" to start the selection process
4. Watch the animated selection
5. Celebrate with confetti when the winner is announced!

## 📋 Excel File Format

Your Excel file should have the following structure:

| Name        | Email                 |
| ----------- | --------------------- |
| John Doe    | john.doe@email.com    |
| Jane Smith  | jane.smith@email.com  |
| Bob Johnson | bob.johnson@email.com |

**Note:** The "Name" column is required. The "Email" column is optional.

## 🛠️ Built With

- **React** - Frontend framework
- **react-qr-code** - QR code generation
- **xlsx** - Excel file processing
- **file-saver** - File download functionality

## 📱 Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## 💾 Data Storage

All data (student lists, attendance links) is stored locally in your browser using localStorage. This means:

- Your data persists between sessions
- No data is sent to external servers
- Your information stays private

## 🎨 Features

- **Responsive Design** - Works on desktop, tablet, and mobile
- **Modern UI** - Beautiful gradients and animations
- **User-Friendly** - Intuitive interface with clear instructions
- **Accessibility** - Keyboard navigation and screen reader support
- **Performance** - Fast loading and smooth interactions

## 🔧 Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run eject` - Ejects from Create React App (not recommended)

## 📝 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Feel free to submit issues and enhancement requests!

## 📞 Support

If you encounter any issues or have questions, please check the browser console for error messages or create an issue in the project repository.

---

**Made with ❤️ for teachers and students**
