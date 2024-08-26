import User from "../models/User.js"

/* READ */
export const getUser = async (res, req) => {
    try {
        const {id} = req.params;
        const user = await User.findById(id);
        res.status(200).json(User);
    } catch (err) {
        res.status(404).json({message: err.message})
    }
}

export const getUserFriends = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        const friends = await Promise.all(
            user.friends.map((id) => User.findById(id))
        );
        const formattedFriends = friends.map(
            ({_id, firstName, lastName, occupation, location, picturePath}) => {
                return {_id, firstName, lastName, occupation, location, picturePath}
            }
        );
        res.status(200).json(formattedFriends);
    } catch (err) {
        res.status(404).json({message: err.message})

    }
}

/* UPDATE */
export const addRemoveFriend = async (req, res) => {
    try {
        const {id, friendID} = req.params;
        const user = await User.findById(id);
        const friend = await User.findById(friendID);
        
        if(user.friends.includes(friendID)){
            user.friends.filter((id) => id !== friendID);
            friend.friends.filter((id) => id !== id);
        } else {
            user.friends.push(friendID);
            friend.friends.push(id);
            }
        await user.save();
        await friend.save();
         
        const formattedFriends = friends.map(
            ({_id, firstName, lastName, occupation, location, picturePath}) => {
                return {_id, firstName, lastName, occupation, location, picturePath}
            }
        );
        res.status(200).json(formattedFriends);

    } catch (err) {
        res.status(404).json({message: err.message})
    }
}