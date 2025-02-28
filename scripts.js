document.querySelector('form').addEventListener('submit', function (event) {
    event.preventDefault();
    alert('信息已发送！');
});

let currentProject = 0;
const slides = document.querySelectorAll('.project-slide');
const totalProjects = slides.length;

// 初始化显示第一个项目
function initializeSlider() {
    if (slides.length > 0) {
        slides[0].classList.add('active');
    }
    createDots(); // 动态创建圆点
}

function createDots() {
    const dotsContainer = document.querySelector('.dots-container');
    dotsContainer.innerHTML = ''; // 清空现有的圆点

    slides.forEach((_, index) => {
        const dot = document.createElement('span');
        dot.classList.add('dot');
        if (index === 0) dot.classList.add('active'); // 初始化第一个圆点
        dot.addEventListener('click', () => showProject(index));
        dotsContainer.appendChild(dot);
    });
}

function showProject(index) {
    if (index < 0) {
        index = totalProjects - 1;
    } else if (index >= totalProjects) {
        index = 0;
    }

    slides.forEach(slide => {
        slide.classList.remove('active');
    });

    const dots = document.querySelectorAll('.dot');
    dots.forEach(dot => {
        dot.classList.remove('active');
    });

    slides[index].classList.add('active');
    dots[index].classList.add('active'); // 更新当前圆点
    currentProject = index;
}

function nextProject() {
    showProject((currentProject + 1) % totalProjects);
}

function prevProject() {
    showProject((currentProject - 1 + totalProjects) % totalProjects);
}

document.addEventListener('DOMContentLoaded', function () {
    initializeSlider();

    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            prevProject();
        } else if (e.key === 'ArrowRight') {
            nextProject();
        }
    });
});

// 添加触摸滑动支持
let touchStartX = 0;
let touchEndX = 0;

const slider = document.querySelector('.projects-slider');

slider.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
});

slider.addEventListener('touchend', e => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
});

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;

    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            nextProject();
        } else {
            prevProject();
        }
    }
}

// 自动播放（可选）
// const autoPlayInterval = 5000; // 5秒切换一次
// setInterval(nextProject, autoPlayInterval);

const apiKey = 'sk-MQK8TGYW88iId79DwwuSs5v9rqcW2w4nfpqf2JPKATl7yoT7'; // 使用提供的API密钥
const apiUrl = 'https://api.moonshot.cn/v1/chat/completions';
const systemMessages = [
    {
        role: "system",
        content: "你是 Kimi，由 Moonshot AI 提供的人工智能助手。你更擅长中文和英文的对话。你会为用户提供安全，有帮助，准确的回答。同时，你会拒绝一切涉及恐怖主义，种族歧视，黄色暴力等问题的回答。Moonshot AI 为专有名词，不可翻译成其他语言。用户是严海畅，专注于UI/UX设计与AI技术的结合。"
    }
];
let messages = [];

function makeMessages(input, n = 20) {
    messages.push({
        role: "user",
        content: input
    });

    let newMessages = [...systemMessages];

    // 动态添加用户信息
    newMessages.push({
        role: "system",
        content: "用户是严海畅，专注于UI/UX设计与AI技术的结合。"
    });

    if (messages.length > n) {
        messages = messages.slice(-n);
    }

    newMessages = newMessages.concat(messages);
    return newMessages;
}

async function chat(input) {
    const chatMessages = makeMessages(input);

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: "moonshot-v1-8k",
                messages: chatMessages,
                temperature: 0.3
            })
        });

        if (!response.ok) {
            console.error('Network response was not ok:', response.statusText);
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        const assistantMessage = data.choices[0].message;
        messages.push(assistantMessage);

        return assistantMessage.content;
    } catch (error) {
        console.error('Error fetching AI response:', error);
        throw error;
    }
}

// 使用示例
async function sendMessage() {
    const userInput = document.getElementById('user-input');
    const chatBox = document.getElementById('chat-box');
    const userMessage = userInput.value.trim();

    if (userMessage) {
        const userMessageElement = document.createElement('div');
        userMessageElement.className = 'chat-message user-message';
        userMessageElement.textContent = `你: ${userMessage}`;
        chatBox.appendChild(userMessageElement);

        userInput.value = '';

        try {
            const aiResponse = await chat(userMessage);
            const aiMessageElement = document.createElement('div');
            aiMessageElement.className = 'chat-message ai-message';
            aiMessageElement.textContent = `AI: ${aiResponse}`;
            chatBox.appendChild(aiMessageElement);
        } catch (error) {
            console.error('Error fetching AI response:', error);
            const errorMessageElement = document.createElement('div');
            errorMessageElement.className = 'chat-message ai-message';
            errorMessageElement.textContent = 'AI: 抱歉，无法获取响应。';
            chatBox.appendChild(errorMessageElement);
        }

        chatBox.scrollTop = chatBox.scrollHeight;
    }
}

// 为输入框添加键盘事件监听器
document.getElementById('user-input').addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        event.preventDefault(); // 阻止默认的Enter键行为（如换行）
        sendMessage(); // 调用发送消息的函数
    }
});

document.addEventListener('DOMContentLoaded', function () {
    const wechatLink = document.getElementById('wechat-link');
    const wechatModal = document.getElementById('wechat-modal');
    const closeModal = document.getElementById('close-modal');
    const modalContent = wechatModal.querySelector('.modal-content');

    // 打开模态框
    wechatLink.addEventListener('click', function () {
        wechatModal.style.display = 'block';
    });

    // 点击关闭按钮关闭模态框
    closeModal.addEventListener('click', function () {
        wechatModal.style.display = 'none';
    });

    // 点击模态框外部关闭模态框
    wechatModal.addEventListener('click', function (event) {
        // 如果点击的是模态框本身（而不是其内容）
        if (event.target === wechatModal) {
            wechatModal.style.display = 'none';
        }
    });
});

function showProjectDetail(type) {
    // 防止默认的链接行为
    event.preventDefault();

    // 根据类型导航到不同的页面
    switch (type) {
        case 'interaction':
            window.location.href = 'projects/interaction-design.html';
            break;
        case 'research':
            window.location.href = 'projects/user-research.html';
            break;
        case 'demo':
            window.location.href = 'projects/demo-system.html';
            break;
    }
}