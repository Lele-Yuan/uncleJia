# build.sh
# 错误时停止
set -e

# # 打包
# npm run build

# # 进入目标文件夹
# cd dist

# 提交到本地仓库

git init
git add -A

read -p "请输入本次commit message：" commitMessage
git commit -m ${commitMessage}


read -p "是否要提交到master？yes/no" checkMaster

if [[ $checkMaster = 'yes' ]]; 
then
    git add .
    git commit -m $commitMessage
    git push origin master
    echo 'has pushed to master'
elif [[ $checkMaster = 'no' ]];
then
    echo 'ignore master commit'
else
  echo "Input Error"
fi

# 提交到 https://github.com/Lele-Yuan/uncleJia.git 项目的 main 分支
# main 分支作为 gitHub pages 的部署分支
git push -f https://github.com/Lele-Yuan/uncleJia.git master:main

cd -
