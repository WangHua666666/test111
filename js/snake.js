class Snake {
    constructor(size) {
        this.size = size; // 蛇身方块的大小
        this.reset();
        this.headDirection = 'right';
    }

    reset() {
        // 初始化蛇的位置和方向
        this.body = [
            { x: 3, y: 1 },
            { x: 2, y: 1 },
            { x: 1, y: 1 }
        ];
        this.direction = 'right';
        this.nextDirection = 'right';
    }

    move(food) {
        // 更新方向
        this.direction = this.nextDirection;

        // 获取蛇头位置
        const head = { ...this.body[0] };

        // 根据方向移动蛇头
        switch (this.direction) {
            case 'up': head.y--; break;
            case 'down': head.y++; break;
            case 'left': head.x--; break;
            case 'right': head.x++; break;
        }

        // 检查是否吃到食物
        const ateFood = head.x === food.x && head.y === food.y;

        // 将新头部添加到身体数组的开头
        this.body.unshift(head);

        // 如果没有吃到食物，删除尾部；如果吃到食物，保留尾部（这样就增长了一节）
        if (!ateFood) {
            this.body.pop();
        }

        return ateFood;
    }

    setDirection(newDirection) {
        // 防止直接反向移动
        const opposites = {
            'up': 'down',
            'down': 'up',
            'left': 'right',
            'right': 'left'
        };

        if (opposites[newDirection] !== this.direction) {
            this.nextDirection = newDirection;
            this.headDirection = newDirection;
        }
    }

    checkCollision(gridSize) {
        const head = this.body[0];

        // 检查是否撞墙
        if (head.x < 0 || head.x >= gridSize || head.y < 0 || head.y >= gridSize) {
            return true;
        }

        // 检查是否撞到自己
        return this.body.slice(1).some(segment => 
            segment.x === head.x && segment.y === head.y
        );
    }
} 