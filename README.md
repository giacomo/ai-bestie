<p align="center">
  <img src="public/logo.png" width="256px" alt="AI Bestie Logo"/>
</p>

# AI Bestie


AI Bestie is a desktop chat application that provides a friendly interface to interact with AI language models through OpenRouters API. Chat naturally with AI assistants in your preferred language with a clean, intuitive interface.

## Features
- Seamless AI Conversations: Create and manage multiple chat conversations with AI models
- Multiple Language Support: Chat in any language - the AI responds in the same language
- Responsive Design: Works well on desktop and mobile views
- Conversation History: Browse and switch between your past conversations
- Model Selection: Configure which AI model you want to chat with
- Privacy Focused: Your conversations stay local - no data storage on external servers

## Installation
### Prerequisites
- Node.js (v16+)
- yarn

### Setup

```bash
# Clone the repository
git clone https://github.com/giacomo/ai-bestie.git

# Navigate to project directory
cd ai-bestie

# Install dependencies for electron app
yarn install 

# Install dependencies for the web app
cd angular-app

# Install dependencies for the angular-app
yarn install 

# Switch back to the root directory
cd ..

# Build the angular-app
yarn build 
# Package the electron app for Windows
yarn package:win 
# Package the electron app for macOS
yarn package:mac
# Package the electron app for Linux
yarn package:linux
```


### Development
To run the application in development mode:

#### Angular App
```bash
# The angular app
cd angular-app
ng serve --port 4235
```

#### Electron App
```bash
# The electron app
yarn electron:dev
```


## Usage
1. Start a new chat:
    - Click "New Chat" in the sidebar
    - Begin typing your message in the input field

2. Configure settings:
   - Click the "Settings" button in the sidebar
   - Choose your preferred AI model from the dropdown
   - Paste your OpenRouters API key to enable AI interactions

3. Manage conversations:
   - Use the sidebar to switch between different conversations
   - Each conversation maintains its own history during the session
   - Restarting the app will clear the conversation history

## Contributing
Contributions are welcome! Please follow these steps to contribute:
1. Fork the repository
2. Create a new branch for your feature or bug fix
3. Make your changes and commit them
4. Push to your branch
5. Create a pull request with a clear description of your changes
6. Ensure your code adheres to the project's coding standards

## License
This project is licensed under the MIT License.