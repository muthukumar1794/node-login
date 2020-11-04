const userModal = require('./auth.model');

const service ={

    saveUser: async(data)=>{
        try {
            const saveSeed = await userModal.create(data)
            return saveSeed
        } catch (error) {
            throw error
        }
    },

    getUserByEmail: async(email)=>{
        try {
            const saveSeed = await userModal.find({email:email});
            return saveSeed
        } catch (error) {
            throw error
        }
    }
}

module.exports = service