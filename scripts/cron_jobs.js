
const User = require('../src/models/user');
const Post = require('../src/models/post');
const moment = require('../node_modules/moment');
const Rating = require('../src/models/rating');
const { raiseReputation } = require('../helper/repuationContract');
const { transferAion } = require('../helper/transferAion');

module.exports = {
    giveReputationToUser : async () =>{
        
        let allPost = await Post.find({});
        for(let i=0;i<allPost.length;i++){
            if(allPost[i].status == 'active'){
                //console.log(allPost[i].createdAt.toString());
                let newDateObj = moment(allPost[i].createdAt).add(5, 'm').toDate();

           //console.log("newDateObj:" new Date(newDateObj).getTime())
           // console.log(new Date(allPost[i].createdAt.toString()).getTime())
            //   console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
            //   console.log(allPost[i]._id);
            //   console.log(new Date().getTime());
            //   console.log(new Date(moment(allPost[i].createdAt).toDate()));
            //   console.log(new Date(newDateObj).getTime());
            //   console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
             //  let timeDiff = new Date(newDateObj).getTime() - new Date().getTime();
               if(new Date().getTime() >= new Date(newDateObj).getTime()){
                  
                   let positiveCount = 0 ,negativeCount = 0,positiveUser = [],negativeUser =[];
                   for(let j=0;j<allPost[i].ratings.length;j++){
                       let ratingObject = await Rating.findById({_id : allPost[i].ratings[j]});
                       console.log(ratingObject);
                       if(ratingObject.ratingType == 'positive'){
                           positiveCount++;
                           positiveUser.push(ratingObject.ratedBy);
                       }
                       if(ratingObject.ratingType == 'negative'){
                           negativeCount++;
                           negativeUser.push(ratingObject.ratedBy);
                       }
                   }
                   if(positiveCount == negativeCount){
                    await Post.findOneAndUpdate({_id : allPost[i]._id},{ $set: { result: "noStatus" } });
                   }else if(positiveCount > negativeCount){
                    await Post.findOneAndUpdate({_id : allPost[i]._id},{ $set: { result: "positiveStatus",status : 'inactive' } });
                    await payAndIncreaseReputation(positiveUser);

                   }else if(negativeCount > positiveCount){
                    await Post.findOneAndUpdate({_id : allPost[i]._id},{ $set: { result: "negativeStatus",status :'inactive' } });
                    await payAndIncreaseReputation(negativeUser);
                   }
               }
            }
        }
       
    }
}

const payAndIncreaseReputation  = async (userList) =>{
    let publicKey = '0xa073eb74573e892d5cde20b3bf84f406a41cc669e012678452d00e7f0a06546d';
    for(let k=0;k<userList.length;k++){
        let user = await User.findById({ _id : userList[k]});
        let userPoints = user.reputationPoints;
        let newPoints = userPoints + 100;
        let updateUser = await User.updateOne({_id : userList[k]},{$set : {reputationPoints : newPoints}});
        console.log(updateUser);
       let transaction=await raiseReputation(user.publicKey);
       console.log(user.publicKey);
       console.log("transactionnnnnnnnnn :" , transaction);
        await transferAion("1",user.publicKey);
    }
     
}