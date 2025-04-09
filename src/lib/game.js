// lib/game.js
export class Game {
  constructor(canvas, ctx) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.fruits = [];
    this.bombs = [];
    this.slashes = [];
    this.lastSpawnTime = 0;
    this.lastBombSpawnTime = 0;
    this.spawnInterval = 1200; // ms
    this.bombSpawnInterval = 3000; // ms
    this.fruitTypes = ["apple", "banana", "watermelon", "orange", "pineapple"];
    this.gravity = 0.0025;
    this.lives = 3;
    this.score = 0;
    this.gameOver = false;
    this.isRunning = false;
    this.mouseX = 0;
    this.mouseY = 0;
    this.slashHistory = [];
    this.lastSlashTime = 0;
    this.missedFruits = 0;
  }

  start() {
    this.isRunning = true;
    this.lives = 3;
    this.score = 0;
    this.gameOver = false;
    this.fruits = [];
    this.bombs = [];
    this.slashes = [];
    this.missedFruits = 0;

    // Add event listeners
    this.canvas.addEventListener("mousemove", this.handleMouseMove.bind(this));
    this.canvas.addEventListener("mousedown", this.handleMouseDown.bind(this));
    this.canvas.addEventListener("mouseup", this.handleMouseUp.bind(this));
    
    // For touch devices
    this.canvas.addEventListener("touchmove", this.handleTouchMove.bind(this));
    this.canvas.addEventListener("touchstart", this.handleTouchStart.bind(this));
    this.canvas.addEventListener("touchend", this.handleTouchEnd.bind(this));
  }

  stop() {
    this.isRunning = false;
    
    // Remove event listeners
    this.canvas.removeEventListener("mousemove", this.handleMouseMove.bind(this));
    this.canvas.removeEventListener("mousedown", this.handleMouseDown.bind(this));
    this.canvas.removeEventListener("mouseup", this.handleMouseUp.bind(this));
    
    this.canvas.removeEventListener("touchmove", this.handleTouchMove.bind(this));
    this.canvas.removeEventListener("touchstart", this.handleTouchStart.bind(this));
    this.canvas.removeEventListener("touchend", this.handleTouchEnd.bind(this));
  }

  handleMouseMove(e) {
    const rect = this.canvas.getBoundingClientRect();
    this.mouseX = e.clientX - rect.left;
    this.mouseY = e.clientY - rect.top;
    
    if (this.isSlashing) {
      this.slashHistory.push({ x: this.mouseX, y: this.mouseY, time: performance.now() });
      this.checkCollisions();
    }
  }

  handleMouseDown() {
    this.isSlashing = true;
    this.slashHistory = [{ x: this.mouseX, y: this.mouseY, time: performance.now() }];
    this.lastSlashTime = performance.now();
  }

  handleMouseUp() {
    this.isSlashing = false;
  }
  
  handleTouchMove(e) {
    e.preventDefault();
    if (e.touches.length > 0) {
      const rect = this.canvas.getBoundingClientRect();
      this.mouseX = e.touches[0].clientX - rect.left;
      this.mouseY = e.touches[0].clientY - rect.top;
      
      if (this.isSlashing) {
        this.slashHistory.push({ x: this.mouseX, y: this.mouseY, time: performance.now() });
        this.checkCollisions();
      }
    }
  }

  handleTouchStart(e) {
    e.preventDefault();
    if (e.touches.length > 0) {
      const rect = this.canvas.getBoundingClientRect();
      this.mouseX = e.touches[0].clientX - rect.left;
      this.mouseY = e.touches[0].clientY - rect.top;
      this.isSlashing = true;
      this.slashHistory = [{ x: this.mouseX, y: this.mouseY, time: performance.now() }];
      this.lastSlashTime = performance.now();
    }
  }

  handleTouchEnd(e) {
    e.preventDefault();
    this.isSlashing = false;
  }

  spawnFruit(now) {
    if (now - this.lastSpawnTime > this.spawnInterval) {
      this.lastSpawnTime = now;
      
      // Spawn 1-3 fruits at once
      const fruitCount = Math.floor(Math.random() * 3) + 1;
      
      for (let i = 0; i < fruitCount; i++) {
        const type = this.fruitTypes[Math.floor(Math.random() * this.fruitTypes.length)];
        const size = 40 + Math.random() * 20;
        const x = Math.random() * (this.canvas.width - size * 2) + size;
        const vx = (Math.random() - 0.5) * 1.5;
        const vy = -0.8 - Math.random() * 0.5; // Negative for upward velocity
        
        this.fruits.push({
          type,
          x,
          y: this.canvas.height + size,
          vx,
          vy,
          size,
          rotation: 0,
          rotationSpeed: (Math.random() - 0.5) * 0.1,
          sliced: false,
          halfLeft: null,
          halfRight: null
        });
      }
    }
  }

  spawnBomb(now) {
    if (now - this.lastBombSpawnTime > this.bombSpawnInterval) {
      this.lastBombSpawnTime = now;
      
      // 30% chance to spawn a bomb
      if (Math.random() < 0.3) {
        const size = 40;
        const x = Math.random() * (this.canvas.width - size * 2) + size;
        const vx = (Math.random() - 0.5) * 1.5;
        const vy = -0.8 - Math.random() * 0.5; // Negative for upward velocity
        
        this.bombs.push({
          x,
          y: this.canvas.height + size,
          vx,
          vy,
          size,
          rotation: 0,
          rotationSpeed: (Math.random() - 0.5) * 0.1
        });
      }
    }
  }

  updateFruits(deltaTime) {
    this.fruits.forEach(fruit => {
      if (!fruit.sliced) {
        // Apply gravity
        fruit.vy += this.gravity * deltaTime;
        
        // Update position
        fruit.x += fruit.vx * deltaTime;
        fruit.y += fruit.vy * deltaTime;
        
        // Update rotation
        fruit.rotation += fruit.rotationSpeed * deltaTime;
        
        // Bounce off walls
        if (fruit.x < fruit.size || fruit.x > this.canvas.width - fruit.size) {
          fruit.vx *= -0.8;
        }
        
        // Check if fruit has fallen off screen
        if (fruit.y > this.canvas.height + fruit.size * 2) {
          fruit.missed = true;
          if (!fruit.sliced) this.missedFruits++;
          
          // Lose a life if missed too many fruits
          if (this.missedFruits >= 3) {
            this.lives--;
            this.missedFruits = 0;
          }
        }
      } else {
        // Update sliced halves
        if (fruit.halfLeft) {
          fruit.halfLeft.vy += this.gravity * deltaTime;
          fruit.halfLeft.x += fruit.halfLeft.vx * deltaTime;
          fruit.halfLeft.y += fruit.halfLeft.vy * deltaTime;
          fruit.halfLeft.rotation += fruit.halfLeft.rotationSpeed * deltaTime;
        }
        
        if (fruit.halfRight) {
          fruit.halfRight.vy += this.gravity * deltaTime;
          fruit.halfRight.x += fruit.halfRight.vx * deltaTime;
          fruit.halfRight.y += fruit.halfRight.vy * deltaTime;
          fruit.halfRight.rotation += fruit.halfRight.rotationSpeed * deltaTime;
        }
      }
    });
    
    // Remove fruits that have fallen off the screen
    this.fruits = this.fruits.filter(fruit => {
      if (fruit.sliced) {
        return !(
          (fruit.halfLeft && fruit.halfLeft.y > this.canvas.height + fruit.size * 2) &&
          (fruit.halfRight && fruit.halfRight.y > this.canvas.height + fruit.size * 2)
        );
      } else {
        return !fruit.missed;
      }
    });
  }

  updateBombs(deltaTime) {
    this.bombs.forEach(bomb => {
      // Apply gravity
      bomb.vy += this.gravity * deltaTime;
      
      // Update position
      bomb.x += bomb.vx * deltaTime;
      bomb.y += bomb.vy * deltaTime;
      
      // Update rotation
      bomb.rotation += bomb.rotationSpeed * deltaTime;
      
      // Bounce off walls
      if (bomb.x < bomb.size || bomb.x > this.canvas.width - bomb.size) {
        bomb.vx *= -0.8;
      }
    });
    
    // Remove bombs that have fallen off the screen
    this.bombs = this.bombs.filter(bomb => bomb.y <= this.canvas.height + bomb.size * 2);
  }

  checkCollisions() {
    if (!this.isSlashing || this.slashHistory.length < 2) return;
    
    // Get the last two points of the slash
    const last = this.slashHistory[this.slashHistory.length - 1];
    const prev = this.slashHistory[this.slashHistory.length - 2];
    
    // Check fruits
    let slicedFruits = 0;
    this.fruits.forEach(fruit => {
      if (!fruit.sliced && this.lineCircleIntersect(prev.x, prev.y, last.x, last.y, fruit.x, fruit.y, fruit.size)) {
        fruit.sliced = true;
        slicedFruits++;
        this.score++;
        
        // Create two halves
        const angle = Math.atan2(last.y - prev.y, last.x - prev.x);
        
        fruit.halfLeft = {
          x: fruit.x,
          y: fruit.y,
          vx: fruit.vx - 0.3 * Math.cos(angle + Math.PI/2),
          vy: fruit.vy - 0.3 * Math.sin(angle + Math.PI/2),
          rotation: fruit.rotation,
          rotationSpeed: fruit.rotationSpeed - 0.05
        };
        
        fruit.halfRight = {
          x: fruit.x,
          y: fruit.y,
          vx: fruit.vx + 0.3 * Math.cos(angle + Math.PI/2),
          vy: fruit.vy + 0.3 * Math.sin(angle + Math.PI/2),
          rotation: fruit.rotation,
          rotationSpeed: fruit.rotationSpeed + 0.05
        };
      }
    });
    
    // Check bombs
    this.bombs.forEach(bomb => {
      if (this.lineCircleIntersect(prev.x, prev.y, last.x, last.y, bomb.x, bomb.y, bomb.size)) {
        this.lives = 0; // Game over if bomb is hit
        this.gameOver = true;
      }
    });
    
    return slicedFruits > 0 ? { slicedFruits } : null;
  }

  lineCircleIntersect(x1, y1, x2, y2, cx, cy, r) {
    // Calculate the closest point on the line segment to the circle center
    const dx = x2 - x1;
    const dy = y2 - y1;
    const len = Math.sqrt(dx * dx + dy * dy);
    
    // Normalize direction vector
    const nx = dx / len;
    const ny = dy / len;
    
    // Calculate vector from line start to circle center
    const lcx = cx - x1;
    const lcy = cy - y1;
    
    // Project this vector onto the line direction
    const projection = lcx * nx + lcy * ny;
    
    // Get the closest point on the line segment
    let closestX, closestY;
    
    if (projection < 0) {
      closestX = x1;
      closestY = y1;
    } else if (projection > len) {
      closestX = x2;
      closestY = y2;
    } else {
      closestX = x1 + projection * nx;
      closestY = y1 + projection * ny;
    }
    
    // Check if the closest point is within the circle
    const distance = Math.sqrt(
      (closestX - cx) * (closestX - cx) + 
      (closestY - cy) * (closestY - cy)
    );
    
    return distance <= r;
  }

  drawFruit(fruit) {
    this.ctx.save();
    
    if (!fruit.sliced) {
      // Draw whole fruit
      this.ctx.translate(fruit.x, fruit.y);
      this.ctx.rotate(fruit.rotation);
      
      this.ctx.beginPath();
      this.ctx.arc(0, 0, fruit.size, 0, Math.PI * 2);
      
      // Set color based on fruit type
      switch (fruit.type) {
        case "apple":
          this.ctx.fillStyle = "#ff0000";
          break;
        case "banana":
          this.ctx.fillStyle = "#ffff00";
          break;
        case "watermelon":
          this.ctx.fillStyle = "#00aa00";
          break;
        case "orange":
          this.ctx.fillStyle = "#ffa500";
          break;
        case "pineapple":
          this.ctx.fillStyle = "#ffcc00";
          break;
        default:
          this.ctx.fillStyle = "#ff0000";
      }
      
      this.ctx.fill();
    } else {
      // Draw fruit halves
      if (fruit.halfLeft) {
        this.ctx.save();
        this.ctx.translate(fruit.halfLeft.x, fruit.halfLeft.y);
        this.ctx.rotate(fruit.halfLeft.rotation);
        
        this.ctx.beginPath();
        this.ctx.arc(0, 0, fruit.size, Math.PI / 2, Math.PI * 3 / 2);
        this.ctx.lineTo(0, 0);
        this.ctx.closePath();
        
        // Set color based on fruit type
        switch (fruit.type) {
          case "apple":
            this.ctx.fillStyle = "#ff0000";
            break;
          case "banana":
            this.ctx.fillStyle = "#ffff00";
            break;
          case "watermelon":
            this.ctx.fillStyle = "#00aa00";
            break;
          case "orange":
            this.ctx.fillStyle = "#ffa500";
            break;
          case "pineapple":
            this.ctx.fillStyle = "#ffcc00";
            break;
          default:
            this.ctx.fillStyle = "#ff0000";
        }
        
        this.ctx.fill();
        this.ctx.restore();
      }
      
      if (fruit.halfRight) {
        this.ctx.save();
        this.ctx.translate(fruit.halfRight.x, fruit.halfRight.y);
        this.ctx.rotate(fruit.halfRight.rotation);
        
        this.ctx.beginPath();
        this.ctx.arc(0, 0, fruit.size, Math.PI * 3 / 2, Math.PI / 2);
        this.ctx.lineTo(0, 0);
        this.ctx.closePath();
        
        // Set color based on fruit type
        switch (fruit.type) {
          case "apple":
            this.ctx.fillStyle = "#ff0000";
            break;
          case "banana":
            this.ctx.fillStyle = "#ffff00";
            break;
          case "watermelon":
            this.ctx.fillStyle = "#00aa00";
            break;
          case "orange":
            this.ctx.fillStyle = "#ffa500";
            break;
          case "pineapple":
            this.ctx.fillStyle = "#ffcc00";
            break;
          default:
            this.ctx.fillStyle = "#ff0000";
        }
        
        this.ctx.fill();
        this.ctx.restore();
      }
    }
    
    this.ctx.restore();
  }

  drawBomb(bomb) {
    this.ctx.save();
    this.ctx.translate(bomb.x, bomb.y);
    this.ctx.rotate(bomb.rotation);
    
    // Draw bomb body
    this.ctx.beginPath();
    this.ctx.arc(0, 0, bomb.size, 0, Math.PI * 2);
    this.ctx.fillStyle = "#333";
    this.ctx.fill();
    
    // Draw fuse
    this.ctx.beginPath();
    this.ctx.moveTo(0, -bomb.size);
    this.ctx.lineTo(bomb.size / 2, -bomb.size * 1.5);
    this.ctx.lineWidth = 3;
    this.ctx.strokeStyle = "#a52a2a";
    this.ctx.stroke();
    
    this.ctx.restore();
  }

  drawSlash() {
    if (!this.isSlashing || this.slashHistory.length < 2) return;
    
    const now = performance.now();
    const fadeTime = 500; // ms
    
    this.ctx.beginPath();
    
    let isFirst = true;
    
    for (let i = 0; i < this.slashHistory.length; i++) {
      const point = this.slashHistory[i];
      const age = now - point.time;
      
      if (age > fadeTime) continue;
      
      const opacity = 1 - age / fadeTime;
      
      if (isFirst) {
        this.ctx.moveTo(point.x, point.y);
        isFirst = false;
      } else {
        this.ctx.lineTo(point.x, point.y);
      }
    }
    
    this.ctx.strokeStyle = `rgba(255, 255, 255, ${Math.min(0.8, this.slashHistory.length / 15)})`;
    this.ctx.lineWidth = 5;
    this.ctx.lineCap = "round";
    this.ctx.lineJoin = "round";
    this.ctx.stroke();
    
    // Clean up old points
    this.slashHistory = this.slashHistory.filter(point => now - point.time < fadeTime);
  }

  draw() {
    // Clear canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Draw fruits
    this.fruits.forEach(fruit => this.drawFruit(fruit));
    
    // Draw bombs
    this.bombs.forEach(bomb => this.drawBomb(bomb));
    
    // Draw slash
    this.drawSlash();
    
    // Draw UI
    this.ctx.fillStyle = "#fff";
    this.ctx.font = "24px Arial";
    this.ctx.fillText(`Score: ${this.score}`, 20, 40);
    this.ctx.fillText(`Lives: ${this.lives}`, this.canvas.width - 120, 40);
  }

  update(now) {
    if (!this.isRunning) return null;
    
    const deltaTime = now - (this.lastUpdateTime || now);
    this.lastUpdateTime = now;
    
    if (this.lives <= 0) {
      this.gameOver = true;
      return { gameOver: true, lives: this.lives };
    }
    
    // Spawn new fruits and bombs
    this.spawnFruit(now);
    this.spawnBomb(now);
    
    // Update objects
    this.updateFruits(deltaTime);
    this.updateBombs(deltaTime);
    
    // Draw everything
    this.draw();
    
    const slicedResult = this.checkCollisions();
    
    return {
      slicedFruits: slicedResult ? slicedResult.slicedFruits : 0,
      lives: this.lives,
      gameOver: this.gameOver
    };
  }
}