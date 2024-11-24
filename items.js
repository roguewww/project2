// 修改 script.js

import { objectStates } from '/closeView.js';
import { globalState } from './global.js';

console.log("File1.js: Initial value:", globalState.sharedVariable);
globalState.sharedVariable = 120; // 修改值
console.log("File1.js: Updated value:", globalState.sharedVariable);

// Now you can use objectStates in this file
console.log(objectStates);


document.addEventListener('DOMContentLoaded', function() {
    const DEFAULT_BACKGROUND = 'path/to/default-background.jpg';
    
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

    const container = document.querySelector('.container');
    const propItems = document.querySelectorAll('.prop-item');
    const itemDetailsDiv = document.querySelector('.item-details');

    // 设置默认状态
    function setDefaultState() {
        container.style.backgroundImage = `url(${'items/default.png'})`;
        itemDetailsDiv.innerHTML = ''; // 清空详情
    }

    // 初始化时设置默认状态
    setDefaultState();

    propItems.forEach(item => {
        item.addEventListener('click', function(e) {
            // 移除其他道具的选中状态
            propItems.forEach(i => {
                if (i !== this) {
                    i.classList.remove('selected');
                }
            });

            // 切换当前道具的选中状态
            this.classList.toggle('selected');
            
            // 获取道具ID
            const itemId = this.dataset.itemId;
            const details = itemDetails[itemId];

            if (details) {
                // 无论是否已选中，都显示该道具的详情
                container.style.backgroundImage = `url(${details.backgroundImage})`;

                itemDetailsDiv.innerHTML = `
                    <h2>${details.title}</h2>
                    ${details.subtitle ? `<h3>${details.subtitle}</h3>` : ''}
                    ${details.function ? `<p class="function">${details.function}</p>` : ''}
                    ${details.appearance ? `<p class="appearance">${details.appearance}</p>` : ''}
                `;
            }
        });
    });
});


function goBackPage() {
    window.location.href = "index.html";
  }