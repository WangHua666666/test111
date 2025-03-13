class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        // 设置画布大小
        this.gridSize = 20; // 网格数量
        this.cellSize = 20; // 每个网格的像素大小
        this.canvas.width = this.gridSize * this.cellSize;
        this.canvas.height = this.gridSize * this.cellSize;

        // 初始化游戏对象
        this.snake = new Snake(this.cellSize);
        this.food = this.generateFood();
        
        // 游戏状态
        this.score = 0;
        this.highScore = localStorage.getItem('snakeHighScore') || 0;
        this.isRunning = false;
        this.gameLoop = null;

        // 设置速度
        this.speeds = {
            easy: 200,
            medium: 150,
            hard: 100
        };

        // 添加音效
        this.eatSound = document.getElementById('eatSound');
        this.gameOverSound = document.getElementById('gameOverSound');

        // 初始化事件监听
        this.initEventListeners();
        this.updateScoreDisplay();
    }

    initEventListeners() {
        // 键盘控制
        document.addEventListener('keydown', (e) => {
            const keyActions = {
                'ArrowUp': () => this.snake.setDirection('up'),
                'ArrowDown': () => this.snake.setDirection('down'),
                'ArrowLeft': () => this.snake.setDirection('left'),
                'ArrowRight': () => this.snake.setDirection('right'),
                'Space': () => this.togglePause()
            };

            const action = keyActions[e.code];
            if (action) {
                e.preventDefault();
                action();
            }
        });

        // 按钮控制
        document.getElementById('start-btn').addEventListener('click', () => this.start());
        document.getElementById('restart-btn').addEventListener('click', () => this.start());
    }

    generateFood() {
        while (true) {
            const food = {
                x: Math.floor(Math.random() * this.gridSize),
                y: Math.floor(Math.random() * this.gridSize)
            };

            // 确保食物不会出现在蛇身上
            if (!this.snake.body.some(segment => 
                segment.x === food.x && segment.y === food.y)) {
                return food;
            }
        }
    }

    start() {
        // 重置游戏状态
        this.snake.reset();
        this.food = this.generateFood();
        this.score = 0;
        this.updateScoreDisplay();
        this.isRunning = true;
        
        // 隐藏游戏结束界面
        document.getElementById('game-over').classList.add('hidden');

        // 清除之前的游戏循环
        if (this.gameLoop) clearInterval(this.gameLoop);

        // 开始新的游戏循环
        const speed = this.speeds[document.getElementById('difficulty').value];
        this.gameLoop = setInterval(() => this.update(), speed);
    }

    update() {
        if (!this.isRunning) return;

        // 移动蛇并检查是否吃到食物
        const ateFood = this.snake.move(this.food);

        // 如果吃到食物，生成新食物并更新分数
        if (ateFood) {
            this.food = this.generateFood();
            this.score++;
            this.updateScoreDisplay();
            // 播放吃食物音效
            this.eatSound.currentTime = 0;
            this.eatSound.play();
        }

        // 检查碰撞
        if (this.snake.checkCollision(this.gridSize)) {
            this.gameOver();
            return;
        }

        // 绘制游戏状态
        this.draw();
    }

    draw() {
        // 清空画布
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // 绘制食物
        this.ctx.fillStyle = 'red';
        this.ctx.fillRect(
            this.food.x * this.cellSize,
            this.food.y * this.cellSize,
            this.cellSize,
            this.cellSize
        );

        // 绘制蛇
        this.ctx.fillStyle = 'green';
        this.snake.body.forEach((segment, index) => {
            if (index === 0) {
                // 绘制蛇头
                this.ctx.save();
                this.ctx.translate(
                    segment.x * this.cellSize + this.cellSize / 2,
                    segment.y * this.cellSize + this.cellSize / 2
                );
                
                // 根据方向旋转
                const rotations = {
                    'up': 0,
                    'right': Math.PI / 2,
                    'down': Math.PI,
                    'left': -Math.PI / 2
                };
                this.ctx.rotate(rotations[this.snake.headDirection]);
                
                // 绘制蛇头主体
                this.ctx.fillRect(
                    -this.cellSize / 2,
                    -this.cellSize / 2,
                    this.cellSize,
                    this.cellSize
                );
                
                // 绘制眼睛
                this.ctx.fillStyle = 'white';
                this.ctx.beginPath();
                this.ctx.arc(-3, -3, 2, 0, Math.PI * 2);
                this.ctx.arc(3, -3, 2, 0, Math.PI * 2);
                this.ctx.fill();
                
                this.ctx.restore();
            } else {
                // 绘制蛇身
                this.ctx.fillRect(
                    segment.x * this.cellSize,
                    segment.y * this.cellSize,
                    this.cellSize,
                    this.cellSize
                );
            }
        });
    }

    gameOver() {
        this.isRunning = false;
        clearInterval(this.gameLoop);

        // 播放游戏结束音效
        this.gameOverSound.currentTime = 0;
        this.gameOverSound.play();

        // 更新最高分
        if (this.score > this.highScore) {
            this.highScore = this.score;
            localStorage.setItem('snakeHighScore', this.highScore);
            this.updateScoreDisplay();
        }

        // 显示游戏结束界面
        document.getElementById('game-over').classList.remove('hidden');
        document.getElementById('final-score').textContent = this.score;
    }

    togglePause() {
        if (!this.gameLoop) return;
        
        if (this.isRunning) {
            clearInterval(this.gameLoop);
            this.isRunning = false;
        } else {
            const speed = this.speeds[document.getElementById('difficulty').value];
            this.gameLoop = setInterval(() => this.update(), speed);
            this.isRunning = true;
        }
    }

    updateScoreDisplay() {
        document.getElementById('current-score').textContent = this.score;
        document.getElementById('high-score').textContent = this.highScore;
    }
}

// 初始化游戏
window.onload = () => {
    new Game();
}; 