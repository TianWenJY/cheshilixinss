import Mock from 'mockjs'

Mock.mock('http://localhost:8080/user',{
    'name':'@name',//随机生成姓名
    'email':'@email',
    'age|1-10':5
});
Mock.mock('http://localhost:8080/menu',{
    'id':'@increment',//随机生成姓名
    'name':'menu',
    'order|10-20':12
});
