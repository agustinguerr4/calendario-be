'use strict'

import mongoose from 'mongoose'

export async function connect() {
    try {
        await mongoose.connect('mongodb://localhost/weed', {
            useNewUrlParser: true
        })

        console.log('>>>> DB is connected')

    }
    catch(err) {
        console.log('Algo salió mal: ',err)
    }
}

