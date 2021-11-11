import BaseScene from './BaseScene'

class ScoreScene extends BaseScene {

    constructor(config) {

        super('ScoreScene', {...config, canGoBack: true})

    }


    create() {

        this.add.image( 0, 0, 'bestscore').setOrigin(0)

        super.create()

        const bestScore = localStorage.getItem('bestScore')
        this.add.text(...this.screenCenter, `Best Score: ${bestScore || 0}`, 
        this.fontOption = {fontSize: `${this.fontSize}px` , fill:'#fff' })
        .setOrigin(0.5)

        
    }

}

export default ScoreScene