import BaseScene from './BaseScene'

const PipesRender = 5

class PlayScene extends BaseScene {

    constructor(config) {
        super('PlayScene', config)

        this.bird = null
        this.bird2 = null
        this.flowers = null
        this.isPaused = false

        this.flowerHorDis = 0

        this.flapVelocity = 350

        this.score = 0
        this.scoreText = ''

        this.currentDifficulty = 'easy'
        this.difficulties = {
            'easy' : {
                flowerHorizontalDistanceRange: [300 , 350], 
                flowerMouthDistanceRange: [150 , 250]
            },

            'normal' : {
                flowerHorizontalDistanceRange: [280 , 330], 
                flowerMouthDistanceRange: [140 , 190]
            },

            'hard' : {
                flowerHorizontalDistanceRange: [250 , 310], 
                flowerMouthDistanceRange: [120 , 100]
            },

            'pointsSkill' : {
                flowerHorizontalDistanceRange: [300 , 300], 
                flowerMouthDistanceRange: [500 , 500]
            },


        }

    }


    create() {

    this.add.image( 0, 0, 'forest').setOrigin(0)

    this.currentDifficulty = 'easy'
    
    super.create()

    this.createBird()

    this.createPipes()

    this.createColliders()

    this.createScore()

    this.createPause()

    this.createInputs()

    this.listenToEvents()

    this.blueFly()

    }

    update() {

        this.checkStatus()
    
        this.recycleFlower()
        
        this.specialAbility()
        
    }

    listenToEvents() {

        if (this.pauseEvent) {
            return
        }

        this.pauseEvent = this.events.on('resume' , () => {
            this.initiateTime = 3
            this.countDownText = this.add.text(...this.screenCenter, 'Fly in ' + this.initiateTime, this.fontOption)
            .setOrigin(0.5)
            this.timedEvent = this.time.addEvent({
                delay: 1000,
                callback: this.countDown,
                callbackScope: this,
                loop: this
            })
        })
    }

    countDown() {
        this.initiateTime--

        this.countDownText.setText( 'Fly in ' + this.initiateTime )
        if (this.initiateTime <= 0) {
            this.isPaused = false
            this.countDownText.setText('')
            this.physics.resume()
            this.timedEvent.remove()
        }
    }

    createBird() {
        this.bird = this.physics.add.sprite( this.config.startPosition.x , this.config.startPosition .y ,'blueBird')
        .setFlipX(true)
        .setScale(3)
        .setOrigin(0)

        this.bird.setBodySize(this.bird.width , this.bird.height -8)
        this.bird.body.gravity.y = 600
        this.bird.setCollideWorldBounds(true)
    }

    blueFly() {

        this.anims.create({
            key:'fly',
            frames: this.anims.generateFrameNumbers('blueBird', {start: 8, end: 15}),
            frameRate: 8,
            repeat: -1,          
    
        })

        this.bird.play('fly')
        
    }


    specialAbility() {

        if(this.score === 10 || this.score === 40 || this.score === 60) {

            this.bird.setTint(0xff00ff, 0xffff00, 0x0000ff, 0xEE4824)

                this.time.addEvent({
                    delay: 18000,
                    callback: () => {
        
                        this.bird.setTint(0xffffff)
                    },
    
                })

        }


    }


    createColliders() {
        this.physics.add.collider(this.bird, this.flowers, this.gameOver, null, this)
    }

    createPipes() {
        this.flowers = this.physics.add.group() 

        for ( let i = 0 ; i < PipesRender; i++) {

            const  upperFlower = this.flowers.create( 0 , 0 , 'flower').setImmovable(true).setOrigin(0,1)
            const  lowerFlower = this.flowers.create( 0 , 0 , 'flower').setImmovable(true).setOrigin(0 , 0)
        
            this.placeFlower(upperFlower, lowerFlower)

        }

        this.flowers.setVelocityX(-200)


    }

    placeFlower(upFlower, lowFlower) {
        const difficulty = this.difficulties[this.currentDifficulty]

        const rightMostX = this.getRightMostFlower()
    
        const flowerMouthDistance = Phaser.Math.Between(...difficulty.flowerMouthDistanceRange)
        const flowerVerticalPosition = Phaser.Math.Between(0 + 20, this.config.height - 20 - flowerMouthDistance)
        const flowerHorDis = Phaser.Math.Between(...difficulty.flowerHorizontalDistanceRange)
    
        upFlower.x = rightMostX + flowerHorDis
        upFlower.y = flowerVerticalPosition
    
        lowFlower.x = upFlower.x
        lowFlower.y = upFlower.y + flowerMouthDistance
    
    }

    recycleFlower() {
    
        const tempFlowers = []
    
        this.flowers.getChildren().forEach(flower => {
            if (flower.getBounds().right < 0) {
                tempFlowers.push(flower)
                if(tempFlowers.length === 3 ) {
                    this.placeFlower(...tempFlowers)
                    this.increaseScore()
                    this.saveBestScore()
                    this.increaseDifficulty()
                }
            }
        })
    
    }

        
    getRightMostFlower() {
    
        let rightMostX = 0
    
        this.flowers.getChildren().forEach(flower =>  {
            rightMostX = Math.max(flower.x, rightMostX )
        })
    
        return rightMostX
    
    }

    createScore() {
        this.score = 0
        const bestScore = localStorage.getItem('bestScore')
        this.scoreText = this.add.text(16, 16, `Score ${0}`,  { fontSize: '50px' , fill: '#FFF'})
        this.add.text(16, 52, `Best score ${bestScore || 0}`,  { fontSize: '25px' , fill: '#FFF'})
    }

    increaseScore() {
        this.score++
        this.scoreText.setText(`Score ${this.score}`)
    }

    saveBestScore() {

        const bestScoreText = localStorage.getItem('bestScore')
        const bestScore = bestScoreText && parseInt(bestScoreText, 10)

        if(!bestScore || this.score > bestScore) {
            localStorage.setItem('bestScore', this.score)

        }

    }


    createPause() {
        this.isPaused = false
        const pauseButton = this.add.image(this.config.width - 10, this.config.height - 10, 'pause')
        .setInteractive()
        .setOrigin(1)


        pauseButton.on('pointerdown', () => {
            this.isPaused = true
            this.physics.pause()
            this.scene.pause()
            this.scene.launch('PauseScene')
        })
    }

    createInputs() {
        this.input.on('pointerdown', this.flap, this)
        this.input.keyboard.on('keydown_SPACE', this.flap, this)

    }

    
    checkStatus() {

        if (this.bird.getBounds().bottom >= this.config.height || this.bird.y <= 0) {
            this.gameOver()
        }

    }

    increaseDifficulty() {

        if(this.score === 15) {
            this.currentDifficulty = 'normal'
        }

        if(this.score === 30) {
            this.currentDifficulty = 'hard'
        }

        if(this.score === 10 || this.score === 30) {
            this.currentDifficulty = 'pointsSkill'
        }

    }

    gameOver() {

        this.saveBestScore()

        this.physics.pause()
        this.bird.setTint(0xEE4824)

        this.time.addEvent({
            delay: 1000,
            callback: () => {

                this.scene.restart()

            },
            loop: false

        })

    
    }
    

    
    flap() {
        if (this.isPaused) {
            return
        }

        this.bird.body.velocity.y = -this.flapVelocity
    }


}


export default PlayScene