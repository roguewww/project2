import { globalState } from './global.js';

document.addEventListener('DOMContentLoaded', function () {
    const container = document.querySelector('.container');
    const propItems = document.querySelectorAll('.prop-item');
    const resultItems = document.querySelectorAll('.result-item'); // 获取所有 result-item
    const itemDetailsDiv = document.querySelector('.item-details'); // 显示道具详情的区域
    const messageDiv = document.createElement('div'); // 创建消息显示区域
    messageDiv.classList.add('message'); // 添加类名以便样式调整
    document.body.appendChild(messageDiv); // 将消息区域添加到页面中
    console.log(globalState);
    const DEFAULT_BACKGROUND = 'items/default.png'; // 默认背景图片

    const gridImages = {
        var1: {
            0: 'items/good1.png',
            1: 'items/bad1.png',
        },
        var2: {
            0: 'items/good2.png',
            1: 'items/bad2.png',
        },
        var3: {
            0: 'items/good3.png',
            1: 'items/bad3.png',
        },
        var4: {
            0: 'items/good4.png',
            1: 'items/bad4.png',
        },
    };

    const itemDetails = {
        'sun-drum': {
            title: 'Shaman Drum',
            subtitle: '(Wenwang Drum)',
            function: 'The shamanic drum is the most important ritual tool, used to summon gods, drive away evil spirits, and enter a mystical state.',
            appearance: 'Usually a single-sided or double-sided round drum, made of wooden frame and animal skin. The drum may have sacred patterns painted on it.',
            backgroundImage: 'items/drumBg.jpg'
        },
        'bones': {
            title: 'knucklebones',
            subtitle: '',
            function: 'Galabar divination is a folk method of divination where animal knucklebones are thrown, and the combination of the four different sides they land on (upright, flat, standing, or curved) is interpreted to predict fortune, the future, or answer questions.',
            appearance: '',
            backgroundImage: 'items/bonesBg.jpg'
        },
        'whip': {
            title: 'knucklebones',
            subtitle: '',
            function: 'Galabar divination is a folk method of divination where animal knucklebones are thrown, and the combination of the four different sides they land on (upright, flat, standing, or curved) is interpreted to predict fortune, the future, or answer questions.',
            appearance: '',
            backgroundImage: 'items/whipBg.jpg'
        },
        'mask': {
            title: 'knucklebones',
            subtitle: '',
            function: 'Galabar divination is a folk method of divination where animal knucklebones are thrown, and the combination of the four different sides they land on (upright, flat, standing, or curved) is interpreted to predict fortune, the future, or answer questions.',
            appearance: '',
            backgroundImage: 'items/maskBg.jpg'
        },
        'fire': {
            title: 'knucklebones',
            subtitle: '',
            function: 'Galabar divination is a folk method of divination where animal knucklebones are thrown, and the combination of the four different sides they land on (upright, flat, standing, or curved) is interpreted to predict fortune, the future, or answer questions.',
            appearance: '',
            backgroundImage: 'items/fireBg.png'
        },
        'bucket': {
            title: 'knucklebones',
            subtitle: '',
            function: 'Galabar divination is a folk method of divination where animal knucklebones are thrown, and the combination of the four different sides they land on (upright, flat, standing, or curved) is interpreted to predict fortune, the future, or answer questions.',
            appearance: '',
            backgroundImage: 'items/bucketBg.jpg'
        },
        'turtle': {
            title: 'knucklebones',
            subtitle: '',
            function: 'Galabar divination is a folk method of divination where animal knucklebones are thrown, and the combination of the four different sides they land on (upright, flat, standing, or curved) is interpreted to predict fortune, the future, or answer questions.',
            appearance: '',
            backgroundImage: 'items/turtleBg.jpg'
        },
        'sticks': {
            title: 'knucklebones',
            subtitle: '',
            function: 'Galabar divination is a folk method of divination where animal knucklebones are thrown, and the combination of the four different sides they land on (upright, flat, standing, or curved) is interpreted to predict fortune, the future, or answer questions.',
            appearance: '',
            backgroundImage: 'items/sticksBg.jpg'
        }
    };

    // 设置默认背景
    function setDefaultBackground() {
        container.style.backgroundImage = `url(${DEFAULT_BACKGROUND})`;
        itemDetailsDiv.innerHTML = ''; // 清空详情
        messageDiv.textContent = ''; // 清空提示信息
    }

    // 根据 globalState 和 modelKey 更新背景
    function updateContainerBackground(modelKey) {
        const stateValue = globalState[modelKey]; // 获取 globalState 的当前值
        const imageSrc = stateValue !== null ? gridImages[modelKey][stateValue] : null;

        // 清空提示文字
        messageDiv.textContent = '';

        if (stateValue === null) {
            // 如果 globalState 值为 null，显示提示信息
            container.style.backgroundImage = `url(${DEFAULT_BACKGROUND})`;
            messageDiv.textContent = 'Please go divination first, then your result will show here';
            console.log('Set to default background with message');
        } else if (imageSrc) {
            // 如果有对应的图片，更新背景
            container.style.backgroundImage = `url(${imageSrc})`;
            console.log(`Updated background to: ${imageSrc}`);
        }
    }

    // 显示道具详情
    function showItemDetails(itemId) {
        const details = itemDetails[itemId];
        if (details) {
            itemDetailsDiv.innerHTML = `
                <h2>${details.title}</h2>
                ${details.subtitle ? `<h3>${details.subtitle}</h3>` : ''}
                ${details.function ? `<p class="function">${details.function}</p>` : ''}
                ${details.appearance ? `<p class="appearance">${details.appearance}</p>` : ''}
            `;
        } else {
            itemDetailsDiv.innerHTML = ''; // 清空详情
        }
    }

    // 初始化默认背景
    setDefaultBackground();

    // 监听 prop-item 点击事件
    propItems.forEach(item => {
        item.addEventListener('click', function () {
            const itemId = this.dataset.itemId;

            // 清空提示文字
            messageDiv.textContent = '';

            // 显示道具详情
            showItemDetails(itemId);

            // 切换选中状态
            propItems.forEach(i => i.classList.remove('selected'));
            this.classList.add('selected');

            // 更新背景为道具的背景图片
            const details = itemDetails[itemId];
            if (details && details.backgroundImage) {
                container.style.backgroundImage = `url(${details.backgroundImage})`;
            } else {
                setDefaultBackground(); // 如果没有背景图片，设置默认背景
            }
        });
    });

    // 监听 result-item 点击事件
    resultItems.forEach((item, index) => {
        item.addEventListener('click', function () {
            const modelKey = `var${index + 1}`; // 假设 result-item 对应 var1, var2, ...

            // 清空提示文字
            messageDiv.textContent = '';

            if (globalState[modelKey] !== undefined) {
                updateContainerBackground(modelKey); // 更新背景图片或显示消息

                // 清空道具详情
                itemDetailsDiv.innerHTML = '';
            } else {
                console.log(`No state defined for ${modelKey}`);
            }
        });
    });
});

window.goBackPage = function() {
    window.location.href = "index.html";
  }