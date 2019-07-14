import React, { Component } from "react";
import { connect } from "react-redux";
import { BLOG_LIST, ADD_BLOG_LIKE } from "../store/actionTypes";
import { blogModule, likeBlogModule } from "../api/api";
import { Link } from "react-router-dom";
import Comment from "./comment-modal";
import { alertmesage } from "../store/alertmessage";

class BlogList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      blogid: "",
      blogtitle: "",
      content: ""
    };
    this.handleDeleteBlog = this.handleDeleteBlog.bind(this);
    this.settingBlogDetails = this.settingBlogDetails.bind(this);
    this.alertMessage = "";
  }

  async settingBlogDetails(blogid, blogtitle, content) {
    this.refs.commentModal.changeCommentId();
    this.setState({
      blogid: blogid,
      blogtitle: blogtitle,
      content: content
    });
  }

  async handleDeleteBlog(blogid) {
    const deletedbolg = await blogModule.deleteBlog(blogid);
    alertmesage.createNotification(deletedbolg.status, deletedbolg.statusText);
    await this.props.allBlog();
  }

  async componentWillMount() {
    await this.props.allBlog();
  }

  render() {
    if (!this.props.blogs) {
      return "No Blog Found";
    }
    var blogs = Object.values(this.props.blogs);
    return (
      <div className="w3-content" style={{ maxWidth: 1400 }}>
        <Comment
          content={this.state.content}
          title={this.state.title}
          blogid={this.state.blogid}
          comment=" "
          commentshow="false"
          ref="commentModal"
        />
        <header className="w3-container w3-center w3-padding-32">
          <span className="w3-opacity">Welcome to the blog of</span>
          <h3>
            <b> Manohar Kumar Singh</b>
          </h3>
        </header>

        <div className="w3-row">
          <div className="w3-col l8 s12">
            {blogs.map(blog => {
              return (
                <div className="w3-card-4 w3-margin w3-white" key={blog._id}>
                  {blog.path ? (
                    <img
                      src={"../files/" + blog.path.substr(13)}
                      alt="Avatar"
                      className="img"
                      style={{ maxHeight: 300 }}
                    />
                  ) : (
                    <img
                      src="../assets/image/woods.jpg"
                      alt="Avatar"
                      className="img"
                    />
                  )}
                  <div className="w3-container">
                    <h3>
                      <b>-{blog.title}</b>
                    </h3>
                    <h5>
                      Title description,{" "}
                      <span className="w3-opacity">{blog.createdAt}</span>
                    </h5>
                  </div>
                  <div className="w3-container">
                    <p
                      style={{
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis"
                      }}
                    >
                      {blog.content}
                    </p>

                    <div className="w3-row">
                      <div className="w3-col m7 s12">
                        <div className="row">
                          <div className="col-md-4">
                            <p>
                              <Link
                                className="w3-button w3-padding-large w3-white w3-border"
                                to={{
                                  pathname: `/blogdeatils/${blog._id}`,
                                  state: { blog: blog._id }
                                }}
                              >
                                <b> READ MORE» </b>
                              </Link>
                            </p>
                          </div>
                          <div className="col-md-4">
                            <button
                              className="w3-button w3-padding-large w3-border w3-red"
                              onClick={() => this.handleDeleteBlog(blog._id)}
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="w3-col m5 w3-hide-small">
                        {/* Comment Start */}
                        <p>
                          <span className="w3-padding-large w3-right">
                            <span
                              className="pointer"
                              data-toggle="modal"
                              data-target="#myModal"
                              onClick={() =>
                                this.settingBlogDetails(
                                  blog._id,
                                  blog.title,
                                  blog.content
                                )
                              }
                            >
                              <b>Comments &nbsp;</b>
                            </span>
                            <span className="w3-tag">
                              {blog.comments.length}
                            </span>
                          </span>

                          {/* Comment Done */}
                          {/* Like Start*/}
                          <span className="w3-padding-large w3-right">
                            <span
                              className="pointer"
                              data-toggle="modal"
                              data-target="#myModal"
                              onClick={() =>
                                this.settingBlogDetails(
                                  blog._id,
                                  blog.title,
                                  blog.content
                                )
                              }
                            >
                              <b>Likes &nbsp;</b>
                            </span>
                            <span className="w3-tag">
                              {blog.comments.length}
                            </span>
                          </span>
                        </p>
                        {/* Like Done */}
                      </div>
                    </div>
                  </div>{" "}
                  <hr />
                </div>
              );
            })}
          </div>

          <div className="w3-col l4">
            <div className="w3-card w3-margin w3-margin-top">
              <img
                src="../assets/image/me.jpg"
                style={{ width: "100%" }}
                alt="avtar"
              />
              <div className="w3-container w3-white">
                <h4>
                  <b>Manohar Kumar Singh (M. C. A)</b>
                </h4>
                <p>
                  Experienced Software Engineer with a demonstrated history of
                  working in the information services industry.Skilled in Mysql,
                  Postgresql,MongoDB(Basic) Js, Jquery, React js, Vue Js,
                  Angular4, Bootstrap, Php, Html, Css,Wordpress Plugin
                  Development,Theme Development,Node Js Basic(Writing API), Code
                  Optimization.Strong engineering professional with a Master
                  degree focused in Computer Science from National Institute of
                  Technology Calict (NITC).
                </p>
              </div>
            </div>
            <hr />

            <div className="w3-card w3-margin">
              <div className="w3-container w3-padding">
                <h4>Top 5 Popular Posts</h4>
              </div>
              <ul className="w3-ul w3-hoverable w3-white">
                <li className="w3-padding-16">
                  <img
                    src="../assets/image/pop1.jpg"
                    alt="Avtar"
                    className="w3-left w3-margin-right"
                    style={{ width: 50 }}
                  />
                  <span className="w3-large">Lorem</span>
                  <br />
                  <span>Sed mattis nunc</span>
                </li>
                <li className="w3-padding-16">
                  <img
                    src="../assets/image/pop2.jpg"
                    alt="avtar"
                    className="w3-left w3-margin-right"
                    style={{ width: 50 }}
                  />
                  <span className="w3-large">Ipsum</span>
                  <br />
                  <span>Praes tinci sed</span>
                </li>
                <li className="w3-padding-16">
                  <img
                    src="../assets/image/pop3.jpg"
                    alt="Avtar"
                    className="w3-left w3-margin-right"
                    style={{ width: 50 }}
                  />
                  <span className="w3-large">Dorum</span>
                  <br />
                  <span>Ultricies congue</span>
                </li>
                <li className="w3-padding-16 w3-hide-medium w3-hide-small">
                  <img
                    src="../assets/image/pop4.jpg"
                    alt="Avtar"
                    className="w3-left w3-margin-right"
                    style={{ width: 50 }}
                  />
                  <span className="w3-large">Mingsum</span>
                  <br />
                  <span>Lorem ipsum dipsum</span>
                </li>
              </ul>
            </div>
            <hr />
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    blogs: state.Blog.blogs
  };
}
const mapDispatchToProps = dispatch => ({
  allBlog: async () =>
    dispatch({
      type: BLOG_LIST,
      payload: await blogModule.getBlog()
    }),
  blogLike: async blogid =>
    dispatch({
      type: ADD_BLOG_LIKE,
      paload: await likeBlogModule.likeBlog(blogid)
    })
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BlogList);
