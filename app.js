// Task Manager App with AI Integration
class TaskManager {
    constructor() {
        this.tasks = this.loadTasks();
        this.currentList = 'my-day';
        this.selectedTask = null;
        this.apiKey = localStorage.getItem('gemini_api_key');
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateDate();
        this.renderTasks();
        this.updateAllCounts();
        
        // Check if API key exists
        if (!this.apiKey) {
            this.showApiKeyModal();
        }
    }

    setupEventListeners() {
        // Add task
        document.getElementById('quickAddBtn').addEventListener('click', () => this.addTask());
        document.getElementById('taskInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addTask();
        });
        document.getElementById('taskInput').addEventListener('input', (e) => {
            document.getElementById('quickAddBtn').classList.toggle('visible', e.target.value.trim() !== '');
        });

        // Navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
                item.classList.add('active');
                this.currentList = item.dataset.list;
                this.updateListTitle();
                this.renderTasks();
            });
        });

        // AI Buttons
        document.getElementById('aiSuggestBtn').addEventListener('click', () => this.openAIModal('suggest'));
        document.getElementById('aiGenerateBtn').addEventListener('click', () => this.openAIModal('generate'));
        document.getElementById('aiSubmitBtn').addEventListener('click', () => this.handleAIRequest());
        
        // Modals
        document.getElementById('closeModal').addEventListener('click', () => this.closeAIModal());
        document.getElementById('aiModal').addEventListener('click', (e) => {
            if (e.target.id === 'aiModal') this.closeAIModal();
        });
        
        // API Key Modal
        document.getElementById('closeApiKeyModal').addEventListener('click', () => this.closeApiKeyModal());
        document.getElementById('saveApiKeyBtn').addEventListener('click', () => this.saveApiKey());
        
        // Task detail
        document.getElementById('closeDetailBtn').addEventListener('click', () => this.closeTaskDetail());
    }

    // Task Management
    addTask() {
        const input = document.getElementById('taskInput');
        const title = input.value.trim();
        
        if (!title) return;

        const task = {
            id: Date.now().toString(),
            title: title,
            completed: false,
            important: false,
            myDay: this.currentList === 'my-day',
            dueDate: null,
            notes: '',
            createdAt: new Date().toISOString()
        };

        this.tasks.push(task);
        this.saveTasks();
        input.value = '';
        document.getElementById('quickAddBtn').classList.remove('visible');
        this.renderTasks();
        this.updateAllCounts();
    }

    toggleComplete(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (task) {
            task.completed = !task.completed;
            this.saveTasks();
            this.renderTasks();
            this.updateAllCounts();
        }
    }

    toggleImportant(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (task) {
            task.important = !task.important;
            this.saveTasks();
            this.renderTasks();
            this.updateAllCounts();
        }
    }

    deleteTask(taskId) {
        this.tasks = this.tasks.filter(t => t.id !== taskId);
        this.saveTasks();
        this.renderTasks();
        this.updateAllCounts();
        this.closeTaskDetail();
    }

    showTaskDetail(taskId) {
        this.selectedTask = this.tasks.find(t => t.id === taskId);
        if (!this.selectedTask) return;

        const detailContent = document.getElementById('detailContent');
        detailContent.innerHTML = `
            <div class="detail-task-title">${this.selectedTask.title}</div>
            
            <div class="detail-section">
                <h4>Notes</h4>
                <textarea id="taskNotes" placeholder="Add notes...">${this.selectedTask.notes || ''}</textarea>
            </div>
            
            <div class="detail-section">
                <button class="ai-btn" onclick="taskManager.deleteTask('${this.selectedTask.id}')">
                    <i class="fas fa-trash"></i> Delete Task
                </button>
            </div>
        `;

        document.getElementById('taskNotes').addEventListener('input', (e) => {
            if (this.selectedTask) {
                this.selectedTask.notes = e.target.value;
                this.saveTasks();
            }
        });

        document.getElementById('taskDetail').classList.add('active');
    }

    closeTaskDetail() {
        document.getElementById('taskDetail').classList.remove('active');
        this.selectedTask = null;
    }

    getFilteredTasks() {
        switch (this.currentList) {
            case 'my-day':
                return this.tasks.filter(t => t.myDay && !t.completed);
            case 'important':
                return this.tasks.filter(t => t.important && !t.completed);
            case 'planned':
                return this.tasks.filter(t => t.dueDate && !t.completed);
            case 'all':
                return this.tasks.filter(t => !t.completed);
            case 'completed':
                return this.tasks.filter(t => t.completed);
            default:
                return this.tasks;
        }
    }

    renderTasks() {
        const taskList = document.getElementById('taskList');
        const tasks = this.getFilteredTasks();

        if (tasks.length === 0) {
            taskList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-check-circle"></i>
                    <p>No tasks yet. Add one to get started!</p>
                </div>
            `;
            return;
        }

        taskList.innerHTML = tasks.map(task => `
            <div class="task-item ${task.completed ? 'completed' : ''}" data-id="${task.id}">
                <div class="task-checkbox ${task.completed ? 'completed' : ''}" onclick="taskManager.toggleComplete('${task.id}')">
                    ${task.completed ? '<i class="fas fa-check"></i>' : ''}
                </div>
                <div class="task-content" onclick="taskManager.showTaskDetail('${task.id}')">
                    <div class="task-title">${task.title}</div>
                    ${task.notes ? `<div class="task-subtitle"><i class="fas fa-sticky-note"></i> ${task.notes.substring(0, 50)}${task.notes.length > 50 ? '...' : ''}</div>` : ''}
                </div>
                <div class="task-actions">
                    <button class="task-action-btn ${task.important ? 'important' : ''}" onclick="taskManager.toggleImportant('${task.id}')">
                        <i class="fas fa-star"></i>
                    </button>
                    <button class="task-action-btn" onclick="taskManager.deleteTask('${task.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');
    }

    updateListTitle() {
        const titles = {
            'my-day': 'My Day',
            'important': 'Important',
            'planned': 'Planned',
            'all': 'All Tasks',
            'completed': 'Completed'
        };
        const icons = {
            'my-day': 'fa-sun',
            'important': 'fa-star',
            'planned': 'fa-calendar',
            'all': 'fa-infinity',
            'completed': 'fa-check-circle'
        };
        
        document.getElementById('listTitle').textContent = titles[this.currentList];
        document.querySelector('.header-title i').className = `fas ${icons[this.currentList]}`;
    }

    updateAllCounts() {
        const counts = {
            'my-day': this.tasks.filter(t => t.myDay && !t.completed).length,
            'important': this.tasks.filter(t => t.important && !t.completed).length,
            'planned': this.tasks.filter(t => t.dueDate && !t.completed).length,
            'all': this.tasks.filter(t => !t.completed).length,
            'completed': this.tasks.filter(t => t.completed).length
        };

        document.querySelectorAll('.nav-item').forEach(item => {
            const list = item.dataset.list;
            const countElem = item.querySelector('.task-count');
            if (countElem) {
                countElem.textContent = counts[list] || 0;
            }
        });
    }

    updateDate() {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const dateStr = new Date().toLocaleDateString('en-US', options);
        document.getElementById('currentDate').textContent = dateStr;
    }

    // Local Storage
    saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
    }

    loadTasks() {
        const tasks = localStorage.getItem('tasks');
        return tasks ? JSON.parse(tasks) : [];
    }

    // AI Features
    openAIModal(mode) {
        if (!this.apiKey) {
            this.showApiKeyModal();
            return;
        }

        const modal = document.getElementById('aiModal');
        const prompt = document.getElementById('aiPrompt');
        const response = document.getElementById('aiResponse');
        
        response.classList.remove('active');
        response.innerHTML = '';
        
        if (mode === 'suggest') {
            prompt.placeholder = 'Ask AI for task suggestions... (e.g., "Suggest tasks for learning Python" or "What should I do to prepare for a job interview?")';
            prompt.value = '';
        } else {
            prompt.placeholder = 'Describe what you want to do and AI will create tasks... (e.g., "Create a weekly workout plan" or "Plan a trip to Japan")';
            prompt.value = '';
        }
        
        modal.classList.add('active');
    }

    closeAIModal() {
        document.getElementById('aiModal').classList.remove('active');
    }

    async handleAIRequest() {
        const prompt = document.getElementById('aiPrompt').value.trim();
        if (!prompt) return;

        const submitBtn = document.getElementById('aiSubmitBtn');
        const responseDiv = document.getElementById('aiResponse');
        
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<div class="loading"></div> Thinking...';
        responseDiv.classList.add('active');
        responseDiv.innerHTML = '<p>AI is thinking...</p>';

        try {
            const aiResponse = await this.callGeminiAPI(prompt);
            const tasks = this.parseAIResponse(aiResponse);
            
            responseDiv.innerHTML = `
                <h4>AI Generated Tasks:</h4>
                <pre>${aiResponse}</pre>
            `;
            
            // Add tasks from AI response
            if (tasks.length > 0) {
                setTimeout(() => {
                    if (confirm(`AI has generated ${tasks.length} tasks. Would you like to add them to your list?`)) {
                        tasks.forEach(title => {
                            this.tasks.push({
                                id: Date.now().toString() + Math.random(),
                                title: title,
                                completed: false,
                                important: false,
                                myDay: true,
                                dueDate: null,
                                notes: 'Generated by AI',
                                createdAt: new Date().toISOString()
                            });
                        });
                        this.saveTasks();
                        this.renderTasks();
                        this.updateAllCounts();
                        this.closeAIModal();
                    }
                }, 500);
            }
        } catch (error) {
            responseDiv.innerHTML = `<p style="color: var(--important-color);">Error: ${error.message}</p>`;
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send';
        }
    }

    async callGeminiAPI(prompt) {
        const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';
        
        const enhancedPrompt = `You are a task management assistant. The user asked: "${prompt}". 
        
Please provide a list of specific, actionable tasks. Format your response as a numbered list of tasks, one per line. Keep each task concise and clear. Provide 5-10 tasks.`;

        const response = await fetch(`${API_URL}?key=${this.apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: enhancedPrompt
                    }]
                }]
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error?.message || 'Failed to get AI response');
        }

        const data = await response.json();
        return data.candidates[0].content.parts[0].text;
    }

    parseAIResponse(response) {
        const tasks = [];
        const lines = response.split('\n');
        
        for (const line of lines) {
            // Match numbered lists (1. Task or 1) Task)
            const match = line.match(/^\d+[\.)]\s*(.+)$/);
            if (match) {
                tasks.push(match[1].trim());
            }
            // Match bullet points (- Task or * Task)
            else if (line.trim().match(/^[-*]\s*(.+)$/)) {
                const bulletMatch = line.trim().match(/^[-*]\s*(.+)$/);
                if (bulletMatch) {
                    tasks.push(bulletMatch[1].trim());
                }
            }
        }
        
        return tasks;
    }

    // API Key Management
    showApiKeyModal() {
        document.getElementById('apiKeyModal').classList.add('active');
    }

    closeApiKeyModal() {
        document.getElementById('apiKeyModal').classList.remove('active');
    }

    saveApiKey() {
        const apiKey = document.getElementById('apiKeyInput').value.trim();
        if (!apiKey) {
            alert('Please enter a valid API key');
            return;
        }

        localStorage.setItem('gemini_api_key', apiKey);
        this.apiKey = apiKey;
        this.closeApiKeyModal();
        alert('API Key saved successfully! You can now use AI features.');
    }
}

// Initialize the app
const taskManager = new TaskManager();
