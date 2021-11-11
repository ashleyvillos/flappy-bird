import Phaser from 'phaser'


class PreloadScene extends Phaser.Scene {

    constructor() {

        super('PreloadScene')

    }

    preload() {

        this.load.image('title' , 'assets/twobirds.png')
        this.load.image('forest' , 'assets/forest.png')
        this.load.image('bestscore' , 'assets/score.png')
        this.load.spritesheet('blueBird' , 'assets/blueBirdSprite.png', { 
            frameWidth: 16, frameHeight: 16}) 
            this.load.spritesheet('redBird' , 'assets/redBirdSprite.png', { 
                frameWidth: 16, frameHeight: 16})
        this.load.image('flower' , 'assets/flower.png')
        this.load.image('pause' , 'assets/pause.png')
        this.load.image('back' , 'assets/back.png')


    }

    create() {

        this.scene.start('MenuScene')
        
    }

}

export default PreloadScene