# build.sh
# 错误时停止
set -e

# 提交到master分支
pushMaster() {
    git add -A
    read -p "请输入本次commit message 并以 / 结束：" -d '/' commitMessage
    echo $commitMessage
    git commit -m "$commitMessage"

    echo 'begin push to master'
    git push -u origin master
    echo 'has pushed to master'

}

# 打包 提交main分支
publishPages() {
    # 打包
    npm run build
    cd dist

    # 提交到本地仓库
    git init
    git add -A
    git commit -m 'republish pages'

    # 提交到 https://github.com/Lele-Yuan/uncleJia.git 项目的 main 分支
    # main 分支作为 gitHub pages 的部署分支
    echo 'push to main and publish pages'
    git push -f https://github.com/Lele-Yuan/uncleJia.git master:main
    echo 'has pushed to main'

    cd -
}

echo '请选择本次操作：'
select actionType in '提交' '发布' '提交并发布' ; 
do
    break;
done
echo $actionType

if [[ $actionType = '提交' ]]; 
then
    echo 'pushMaster'
    pushMaster
elif [[ $actionType = '发布' ]];
then
    echo 'publishPage'
    publishPages
elif [[ $actionType = '提交并发布' ]];
then
    echo 'push and publish'
    pushMaster
    publishPages
else
    echo "Input Error"
fi

# read -p "请输入本次commit message 并以 / 结束：" -d '/' commitMessage
# echo $commitMessage
