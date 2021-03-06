class Comment extends React.Component{
    render(){
        return (
        <div>
            <div className="comment-body">
                {this.props.children}
            </div>
            <div className="comment-author">
                {this.props.author}
                {/*父组件的属性author可以传递给子组件，子组件通过this.props来获取*/}
            </div>
        </div>
        );
    }
}
class CommentForm extends React.Component{
    handleSubmit(e){
        e.preventDefault();
        const author=this.refs.author.getDOMNode().value.trim();
        const body=this.refs.body.getDOMNode().value.trim();
        const form=this.refs.form.getDOMNode();
        this.props.onSubmit({author:author,body:body});
        console.log(author,body);
        form.reset();
    }
    render(){
        return (
            <form className="comment-form" ref="form" onSubmit={e=>{this.handleSubmit(e)}}>
                <input type="text" placeholder="Your name" ref="author"/>
                <input type="text" placeholder="Input your comment" ref="body"/>
                <input type="submit" value="Add Comment"/>
            </form>
        );
    }
}

class CommentList extends React.Component{
    render(){
        {/*3.子组件通过this.props.comments可以访问到这个数组*/}
        console.log(this.props.comments);
        var commentsNode=this.props.comments.map(function(comment,index){
            return <Comment key={'comment-'+index} author={comment.author}>{comment.body}</Comment>
        });
        return (
            <div className="comment-list">
                {commentsNode}
            </div>
        );
    }
}
{/*1.定义一个存放组件信息的数组*/}
var comments=[
    {author:"Sakura",body:"this is my comment"},
];
var other=[
    {author:"Sakura",body:"this is my comment"},
    {author:"misaka",body:"this is my comment2"}
];
class CommentBox extends React.Component{
    constructor(props){
        this.state={
            comments:props.comments||[]
        };
        // 也可以通过state状态来传递,组建的状态 state被改变会引发组件重新渲染
        // 当组件状态被改变时，只会重新渲染真正改变了状态的部分
    }
    componentDidMount(){
        this.loadDataFromServer();
    }

    loadDataFromServer(){
        $.ajax({
            url:this.props.url,
            dataType:"json",
            success:comments =>{
                this.setState({comments:comments});
            },
            error:(xhr,status,err)=>{
                console.log(err.toString());
            }
        });
    }

    handleNewComment(comment){
        const comments=this.state.comments;
        const newComments=comments.concat([comment]);
        this.setState({
            comments:newComments
        });
        setTimeout(()=>{
            $.ajax({
                url:this.props.url,
                dataType:"json",
                type:"POST",
                data:comment,
                success:comments=>{
                    this.setState({comments:comments});
                },
                error:(xhr,status,err)=>{
                    console.log(err.toString());
                    this.setState({comments:comments});
                }
            });
        },2000);
    }

    render(){
        return (
            <div className="comment-box">
                <h1>Comments</h1>
                {/*2.父组件通过属性传递这个数组给子组件*/}
                <CommentList comments={this.state.comments}/>
                <CommentForm onSubmit={comment =>this.handleNewComment(comment)}/>
            </div>
        );
    }
}
box=React.render(
    <CommentBox url="comments.json"/>,
    document.getElementById('content')
);
