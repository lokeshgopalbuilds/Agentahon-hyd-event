# 🔍 Audit Agent

A simple and elegant web application for uploading and auditing files. Built with vanilla HTML, CSS, and JavaScript.

## 📋 Features

- **File Upload**: Upload single or multiple files of any type
- **File Management**: View uploaded files with size information and remove individual files
- **Audit Processing**: Simulate file auditing with visual feedback
- **Results Display**: View detailed audit results including:
  - Total files audited
  - Total size of files
  - File types detected
  - Security findings
- **Responsive Design**: Modern UI with gradient backgrounds and smooth animations
- **User-Friendly**: Intuitive interface with loading states and visual feedback

## 🚀 Getting Started

### Prerequisites

No special prerequisites required! Just a modern web browser.

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/lokeshgopalbuilds/Agentahon-hyd-event.git
   cd Agentahon-hyd-event
   ```

2. Open the application:
   ```bash
   open index.html
   ```
   
   Or simply double-click `index.html` to open it in your default browser.

## 📁 Project Structure

```
Agentahon-hyd-event/
├── index.html          # Main HTML file
├── css/
│   └── styles.css      # Styling and animations
├── js/
│   └── script.js       # Application logic and interactivity
├── assets/             # Static assets (images, icons, etc.)
└── README.md           # Project documentation
```

## 🎨 Usage

1. **Upload Files**:
   - Click the "Upload Files" button
   - Select one or multiple files from your device
   - Uploaded files will appear in the list with their names and sizes

2. **Manage Files**:
   - Review the list of uploaded files
   - Remove any file by clicking the "Remove" button next to it

3. **Run Audit**:
   - Click the "Start Audit" button (enabled once files are uploaded)
   - Wait for the audit process to complete (indicated by loading animation)
   - View the detailed results including file statistics and findings

## 🛠️ Technologies Used

- **HTML5**: Semantic markup and structure
- **CSS3**: Modern styling with gradients, animations, and flexbox
- **JavaScript (ES6+)**: File handling, DOM manipulation, and async operations

## 🎯 Features Breakdown

### File Upload System
- Multiple file selection support
- File size formatting (Bytes, KB, MB, GB)
- Duplicate file prevention
- Dynamic file list rendering

### Audit Engine
- Simulated audit processing
- File type detection
- Security scanning simulation
- Comprehensive results generation

### UI/UX
- Gradient background design
- Smooth hover effects and transitions
- Loading animations
- Responsive card layout
- Color-coded results (success, warning, error)

## 🔧 Customization

### Styling
Edit `css/styles.css` to customize:
- Color schemes and gradients
- Button styles and sizes
- Card dimensions and spacing
- Animation timings

### Functionality
Modify `js/script.js` to:
- Integrate with real audit APIs
- Add custom file validation
- Implement actual security scanning
- Extend audit result types

## 📝 Future Enhancements

- [ ] Backend integration for actual file auditing
- [ ] File type validation and restrictions
- [ ] Progress bar for large file uploads
- [ ] Export audit results as PDF/CSV
- [ ] User authentication and history
- [ ] Drag-and-drop file upload
- [ ] Real-time audit processing
- [ ] Advanced security scanning algorithms

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👤 Author

**Lokesh Gopal**
- GitHub: [@lokeshgopalbuilds](https://github.com/lokeshgopalbuilds)

## 🙏 Acknowledgments

- Developed for Agentahon Hyderabad Event
- Inspired by modern web design principles
- Built with ❤️ using vanilla JavaScript

---

**Note**: This is a demo application with simulated audit functionality. For production use, integrate with actual security scanning and file analysis APIs.
