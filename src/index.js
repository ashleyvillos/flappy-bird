import Phaser from 'phaser' 

import PlayScene from './scenes/PlayScene'
import MenuScene from './scenes/MenuScene'
import PreloadScene from './scenes/PreloadScene'
import ScoreScene from './scenes/ScoreScene'
import PauseScene from './scenes/PauseScene'

const Width = 800
const Height = 600
const birdPosition = {x: Width / 10 , y: Height / 2}

const Shared_Config = {

    width: Width ,
    height: Height ,
    startPosition: birdPosition

}
const Scenes = [PreloadScene, MenuScene, ScoreScene, PlayScene, PauseScene]
const createScene = Scene => new Scene(Shared_Config)
const initScenes = () => Scenes.map(createScene)

const config = {
    type: Phaser.AUTO,
    ...Shared_Config,
    pixelArt: true,
    physics: {
        default: 'arcade',
        arcade : {
            
        }
    },
    scene: initScenes()
}



new Phaser.Game(config)