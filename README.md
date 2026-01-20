# AI-Enhanced To Do App 

A beautiful Microsoft To Do clone with AI integration using Google's free Gemini API.

## Features 

### Core Task Management
- Create, edit, and delete tasks
- Mark tasks as important
- Organize tasks by: My Day, Important, Planned, All Tasks, and Completed
- Add notes to tasks
- Automatic local storage (tasks persist in browser)
- Modern, clean UI inspired by Microsoft To Do

### AI-Powered Features 
- **AI Task Suggestions**: Ask AI for task recommendations based on your goals
- **AI Task Generation**: Describe what you want to accomplish and AI creates a task list
- **Smart Parsing**: Automatically converts AI responses into actionable tasks
- **Free to Use**: Uses Google's Gemini API (free tier available)

## Getting Started 

### 1. Get Your Free Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated key

### 2. Run the Application

Simply open `index.html` in your web browser:

```bash
# Navigate to the project folder
cd "d:\TO DO"

# Open in your default browser (Windows)
start index.html

# Or just double-click index.html
```

### 3. Configure AI Features

On first launch, you'll see an API key setup modal:
- Paste your Gemini API key
- Click "Save Key"
- Your key is stored locally in your browser (never sent anywhere except to Google's API)

## How to Use 

### Basic Tasks
1. **Add a task**: Type in the input field at the top and press Enter or click "Add"
2. **Complete a task**: Click the circle checkbox next to the task
3. **Mark as important**: Click the star icon
4. **View details**: Click on any task to open the detail panel
5. **Delete a task**: Click the trash icon or open task details and click "Delete Task"

### AI Features

#### Get AI Suggestions
1. Click "Get Suggestions" in the sidebar
2. Ask AI anything like:
   - "Suggest tasks for learning Python"
   - "What should I do to improve my productivity?"
   - "Give me ideas for a healthy lifestyle"
3. AI will generate relevant tasks
4. Choose to add them to your list

#### Generate Tasks from Description
1. Click "Generate Tasks" in the sidebar
2. Describe what you want to do:
   - "Create a weekly workout plan"
   - "Plan a trip to Japan"
   - "Prepare for a job interview"
3. AI will create a complete task list
4. Review and add to your tasks

## Technology Stack 

- **Frontend**: Pure HTML5, CSS3, JavaScript (ES6+)
- **Storage**: localStorage (browser-based)
- **AI**: Google Gemini API (free tier)
- **Icons**: Font Awesome 6.4.0
- **No build tools required** - just open and run!

## Features Overview

### Task Organization
- **My Day**: Tasks you want to focus on today
- **Important**: Starred/priority tasks
- **Planned**: Tasks with due dates
- **All Tasks**: View everything
- **Completed**: Review finished tasks

### UI Features
- Responsive design (works on mobile and desktop)
- Beautiful animations and transitions
- Task counts for each list
- Dark text on light background for easy reading
- Hover effects for better interactivity

## Privacy & Security 

- All tasks are stored locally in your browser
- Your API key is stored in localStorage (browser only)
- No data is sent to any server except:
  - AI prompts sent to Google's Gemini API
- No user accounts or registration required
- Works completely offline (except AI features)

## API Usage 

The Gemini API has a generous free tier:
- 60 requests per minute
- 1,500 requests per day
- Perfect for personal task management

## Browser Compatibility 

Works best in modern browsers:
- Chrome/Edge (recommended)
- Firefox
- Safari
- Opera

## Tips & Tricks 

1. **Quick Add**: Start typing and press Enter to quickly add tasks
2. **AI Prompts**: Be specific with AI requests for better results
3. **My Day**: Use "My Day" for daily focus and planning
4. **Important**: Star your top priorities for easy access
5. **Notes**: Add detailed notes to tasks by clicking on them

## Troubleshooting 

### AI features not working?
- Check your API key is entered correctly
- Ensure you have internet connection
- Verify your API key at [Google AI Studio](https://makersuite.google.com/app/apikey)

### Tasks not saving?
- Check browser localStorage is enabled
- Clear browser cache and try again
- Don't use incognito/private mode (localStorage is cleared on exit)

### UI issues?
- Try a different modern browser
- Clear browser cache
- Disable browser extensions temporarily

## Future Enhancements 

Potential features to add:
- [ ] Due dates and reminders
- [ ] Task categories/lists
- [ ] Recurring tasks
- [ ] Dark mode
- [ ] Export/import tasks
- [ ] Collaboration features
- [ ] Calendar integration
- [ ] More AI features (task prioritization, time estimation)

## License

This project is open source and free to use for personal and commercial purposes.

## Credits 

- Inspired by Microsoft To Do
- Icons by Font Awesome
- AI powered by Google Gemini

---

**Enjoy your new AI-enhanced task manager! **

For issues or suggestions, feel free to modify and extend this app as you wish!
