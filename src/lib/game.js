// Fruit class
class Fruit {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.radius = 30;
    this.velocityX = (Math.random() - 0.5) * 2; // Reduced horizontal movement
    this.velocityY = -10 - Math.random() * 2; // Upward velocity
    this.rotation = 0;
    this.rotationSpeed = (Math.random() - 0.5) * 0.1;
    this.sliced = false;
    this.sliceAngle = 0;
    this.half1Rotation = 0;
    this.half2Rotation = 0;
    this.half1VelocityX = 0;
    this.half2VelocityX = 0;
    this.half1VelocityY = 0;
    this.half2VelocityY = 0;
    // Randomly select one of the fruit colors
    const fruitTypes = ['red', 'yellow', 'green', 'orange'];
    this.color = fruitTypes[Math.floor(Math.random() * fruitTypes.length)];
  }

  update() {
    if (!this.sliced) {
      this.x += this.velocityX;
      this.y += this.velocityY;
      this.velocityY += 0.2; // Reduced gravity
      this.rotation += this.rotationSpeed;
    } else {
      // Update sliced halves
      this.half1Rotation += 0.1;
      this.half2Rotation -= 0.1;
      
      this.half1VelocityX += 0.1;
      this.half2VelocityX -= 0.1;
      this.half1VelocityY += 0.3;
      this.half2VelocityY += 0.3;
      
      this.x += this.half1VelocityX;
      this.y += this.half1VelocityY;
    }
  }

  draw(ctx) {
    ctx.save();
    
    if (!this.sliced) {
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);
      
      // Draw fruit circle
      ctx.beginPath();
      ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
      
      // Set color based on fruit type
      switch (this.color) {
        case "red":
          ctx.fillStyle = "#ff3333";
          break;
        case "yellow":
          ctx.fillStyle = "#ffcc00";
          break;
        case "green":
          ctx.fillStyle = "#33cc33";
          break;
        case "orange":
          ctx.fillStyle = "#ff9933";
          break;
        default:
          ctx.fillStyle = "#ff3333";
      }
      
      ctx.fill();
      
      // Add a highlight
      ctx.beginPath();
      ctx.arc(-this.radius/3, -this.radius/3, this.radius/4, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
      ctx.fill();
      
    } else {
      // Draw first half
      ctx.save();
      ctx.translate(this.x - this.radius/2, this.y);
      ctx.rotate(this.half1Rotation);
      
      // Draw half circle
      ctx.beginPath();
      ctx.arc(0, 0, this.radius, Math.PI/2, 3*Math.PI/2);
      ctx.lineTo(0, 0);
      ctx.closePath();
      
      // Set color based on fruit type
      switch (this.color) {
        case "red":
          ctx.fillStyle = "#ff3333";
          break;
        case "yellow":
          ctx.fillStyle = "#ffcc00";
          break;
        case "green":
          ctx.fillStyle = "#33cc33";
          break;
        case "orange":
          ctx.fillStyle = "#ff9933";
          break;
        default:
          ctx.fillStyle = "#ff3333";
      }
      
      ctx.fill();
      ctx.restore();

      // Draw second half
      ctx.save();
      ctx.translate(this.x + this.radius/2, this.y);
      ctx.rotate(this.half2Rotation);
      
      // Draw half circle
      ctx.beginPath();
      ctx.arc(0, 0, this.radius, 3*Math.PI/2, Math.PI/2);
      ctx.lineTo(0, 0);
      ctx.closePath();
      
      // Set color based on fruit type
      switch (this.color) {
        case "red":
          ctx.fillStyle = "#ff3333";
          break;
        case "yellow":
          ctx.fillStyle = "#ffcc00";
          break;
        case "green":
          ctx.fillStyle = "#33cc33";
          break;
        case "orange":
          ctx.fillStyle = "#ff9933";
          break;
        default:
          ctx.fillStyle = "#ff3333";
      }
      
      ctx.fill();
      ctx.restore();
    }
    
    ctx.restore();
  }
}

// Bomb class
class Bomb {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.radius = 30;
    this.velocityX = (Math.random() - 0.5) * 4;
    this.velocityY = -15 - Math.random() * 3;
    this.rotation = 0;
    this.rotationSpeed = (Math.random() - 0.5) * 0.1;
    this.sliced = false;
    this.explosionRadius = 0;
    this.explosionMaxRadius = 60;
    this.explosionSpeed = 5;
    this.explosionOpacity = 1;
  }

  update() {
    if (!this.sliced) {
      this.x += this.velocityX;
      this.y += this.velocityY;
      this.velocityY += 0.3;
      this.rotation += this.rotationSpeed;
    } else {
      // Update explosion animation
      this.explosionRadius += this.explosionSpeed;
      this.explosionOpacity = 1 - (this.explosionRadius / this.explosionMaxRadius);
    }
  }

  draw(ctx) {
    ctx.save();
    if (!this.sliced) {
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);
      
      // Draw bomb body
      ctx.beginPath();
      ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = "#333";
      ctx.fill();
      
      // Draw fuse
      ctx.beginPath();
      ctx.moveTo(0, -this.radius);
      ctx.lineTo(this.radius / 2, -this.radius * 1.5);
      ctx.lineWidth = 3;
      ctx.strokeStyle = "#a52a2a";
      ctx.stroke();
      
      // Draw highlight
      ctx.beginPath();
      ctx.arc(-this.radius/3, -this.radius/3, this.radius/4, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255, 255, 255, 0.2)";
      ctx.fill();
      
    } else {
      // Draw explosion
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.explosionRadius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 0, 0, ${this.explosionOpacity})`;
      ctx.fill();
      
      // Draw inner explosion
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.explosionRadius * 0.7, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 165, 0, ${this.explosionOpacity})`;
      ctx.fill();
      
      // Draw core explosion
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.explosionRadius * 0.4, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 0, ${this.explosionOpacity})`;
      ctx.fill();
    }
    ctx.restore();
  }
}

// Game class
export class Game {
  constructor(canvas, ctx) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.fruits = [];
    this.bombs = [];
    this.slicePoints = [];
    this.lastTime = 0;
    this.fruitSpawnTimer = 0;
    this.isGameRunning = false;
    this.lives = 3;
    this.score = 0;
    this.isSlicing = false;

    // Mouse/touch events
    this.canvas.addEventListener('mousedown', (e) => this.startSlice(e));
    this.canvas.addEventListener('mousemove', (e) => this.moveSlice(e));
    this.canvas.addEventListener('mouseup', () => this.endSlice());
    this.canvas.addEventListener('touchstart', (e) => this.startSlice(e.touches[0]));
    this.canvas.addEventListener('touchmove', (e) => {
      e.preventDefault();
      this.moveSlice(e.touches[0]);
    });
    this.canvas.addEventListener('touchend', () => this.endSlice());
  }

  start() {
    this.fruits = [];
    this.bombs = [];
    this.slicePoints = [];
    this.isGameRunning = true;
    this.lastTime = performance.now();
    this.fruitSpawnTimer = 0;
    this.lives = 3;
    this.score = 0;
  }

  spawnFruit() {
    const x = Math.random() * this.canvas.width;
    const y = this.canvas.height + 30;
    // 20% chance to spawn a bomb instead of a fruit
    if (Math.random() < 0.2) {
      this.bombs.push(new Bomb(x, y));
    } else {
      this.fruits.push(new Fruit(x, y));
    }
  }

  startSlice(e) {
    const rect = this.canvas.getBoundingClientRect();
    const scaleX = this.canvas.width / rect.width;
    const scaleY = this.canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;
    this.isSlicing = true;
    this.slicePoints = [{x, y}];
  }

  moveSlice(e) {
    if (!this.isSlicing) return;
    
    const rect = this.canvas.getBoundingClientRect();
    const scaleX = this.canvas.width / rect.width;
    const scaleY = this.canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;
    this.slicePoints.push({x, y});

    // Keep only last 10 points for trail effect
    if (this.slicePoints.length > 10) {
      this.slicePoints.shift();
    }
  }

  endSlice() {
    this.isSlicing = false;
  }

  checkCollisions() {
    if (this.slicePoints.length < 2) return { slicedFruits: 0, hitBomb: false };

    let slicedCount = 0;
    let hitBomb = false;

    // Check fruit collisions
    this.fruits.forEach(fruit => {
      if (fruit.sliced) return;

      for (let i = 1; i < this.slicePoints.length; i++) {
        const p1 = this.slicePoints[i - 1];
        const p2 = this.slicePoints[i];
        
        const dx = fruit.x - p1.x;
        const dy = fruit.y - p1.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < fruit.radius) {
          fruit.sliced = true;
          const sliceAngle = Math.atan2(p2.y - p1.y, p2.x - p1.x);
          fruit.sliceAngle = sliceAngle;
          fruit.half1VelocityX = fruit.velocityX + Math.cos(sliceAngle) * 2;
          fruit.half2VelocityX = fruit.velocityX - Math.cos(sliceAngle) * 2;
          fruit.half1VelocityY = fruit.velocityY;
          fruit.half2VelocityY = fruit.velocityY;
          slicedCount++;
          this.score += 10;
          break;
        }
      }
    });

    // Check bomb collisions
    this.bombs.forEach(bomb => {
      if (bomb.sliced) return;

      for (let i = 1; i < this.slicePoints.length; i++) {
        const p1 = this.slicePoints[i - 1];
        const p2 = this.slicePoints[i];
        
        const dx = bomb.x - p1.x;
        const dy = bomb.y - p1.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < bomb.radius) {
          bomb.sliced = true;
          hitBomb = true;
          break;
        }
      }
    });

    return { slicedFruits: slicedCount, hitBomb };
  }

  update(currentTime) {
    // Clear canvas with a dark background color
    this.ctx.fillStyle = "#1a1a2e";  // Dark blue background
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    if (!this.isGameRunning) return;

    const deltaTime = (currentTime - this.lastTime) / 1000;
    this.lastTime = currentTime;

    this.fruitSpawnTimer += deltaTime;
    if (this.fruitSpawnTimer > 1.5) {
      this.spawnFruit();
      this.fruitSpawnTimer = 0;
    }

    // Update and draw fruits
    this.fruits = this.fruits.filter(fruit => {
      fruit.update();
      fruit.draw(this.ctx);

      // Remove fruits that have fallen below the screen
      if (fruit.y > this.canvas.height + 50) {
        // Lose a life if an unsliced fruit is missed
        if (!fruit.sliced) {
          this.lives--;
        }
        return false;
      }
      return true;
    });

    // Update and draw bombs
    this.bombs = this.bombs.filter(bomb => {
      bomb.update();
      bomb.draw(this.ctx);

      // Remove bombs that have fallen below the screen or exploded
      if (bomb.y > this.canvas.height + 50 || 
          (bomb.sliced && bomb.explosionRadius > bomb.explosionMaxRadius)) {
        return false;
      }
      return true;
    });

    // Draw slice trail
    if (this.slicePoints.length >= 2) {
      this.ctx.beginPath();
      this.ctx.moveTo(this.slicePoints[0].x, this.slicePoints[0].y);
      for (let i = 1; i < this.slicePoints.length; i++) {
        this.ctx.lineTo(this.slicePoints[i].x, this.slicePoints[i].y);
      }
      this.ctx.strokeStyle = 'white';
      this.ctx.lineWidth = 3;
      this.ctx.lineCap = 'round';
      this.ctx.stroke();
      
      // Add glow effect
      this.ctx.shadowColor = 'white';
      this.ctx.shadowBlur = 10;
      this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
      this.ctx.lineWidth = 6;
      this.ctx.stroke();
      this.ctx.shadowBlur = 0;
    }

    // Check collisions and update score
    const { slicedFruits, hitBomb } = this.checkCollisions();

    // Check game-ending conditions - only when a bomb is sliced
    if (hitBomb) {
      this.lives--;
    }
    
    if (this.lives <= 0) {
      this.stop();
    }

    // Draw UI
    this.ctx.fillStyle = "#fff";
    this.ctx.font = "24px Arial";
    this.ctx.textAlign = "left";
    this.ctx.fillText(`Score: ${this.score}`, 20, 40);
    
    // Draw lives as hearts
    for (let i = 0; i < this.lives; i++) {
      this.drawHeart(this.canvas.width - 30 - i * 40, 30, 15);
    }
    
    // Draw game over text if needed
    if (!this.isGameRunning && this.lives <= 0) {
      this.ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      
      this.ctx.fillStyle = "#fff";
      this.ctx.font = "bold 48px Arial";
      this.ctx.textAlign = "center";
      this.ctx.fillText("GAME OVER", this.canvas.width / 2, this.canvas.height / 2 - 24);
      
      this.ctx.font = "24px Arial";
      this.ctx.fillText(`Final Score: ${this.score}`, this.canvas.width / 2, this.canvas.height / 2 + 24);
      this.ctx.fillText("Click to play again", this.canvas.width / 2, this.canvas.height / 2 + 60);
    }

    return {
      gameOver: this.lives <= 0,
      slicedFruits,
      hitBomb,
      lives: this.lives,
      score: this.score
    };
  }
  
  drawHeart(x, y, size) {
    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.moveTo(x, y + size / 4);
    
    // Left curve
    this.ctx.bezierCurveTo(
      x - size / 2, y - size / 2,
      x - size, y,
      x, y + size
    );
    
    // Right curve
    this.ctx.bezierCurveTo(
      x + size, y,
      x + size / 2, y - size / 2,
      x, y + size / 4
    );
    
    this.ctx.fillStyle = "#ff3366";
    this.ctx.fill();
    this.ctx.restore();
  }

  stop() {
    this.isGameRunning = false;
  }
}