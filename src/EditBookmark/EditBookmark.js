import React, { Component } from 'react';
import BookmarksContext from '../BookmarksContext';
import config from '../config';
import './EditBookmark.css';

const Required = () => <span className="EditBookmark__required">*</span>;

class EditBookmark extends Component {
  static contextType = BookmarksContext;

  state = {
    error: null,
  };

  componentDidMount() {
    const bookmarkId = this.props.match.params.id;
    fetch(`${config.API_ENDPOINT}/${bookmarkId}`, {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${config.API_KEY}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        this.setState({
          id: data.id,
          title: data.title,
          description: data.description,
          url: data.url,
          rating: data.rating,
        });
      })
      .catch((error) => this.setState({ error }));
  }

  handleSubmit = (e) => {
    e.preventDefault();
    // get the form fields from the event
    const { id, title, url, description, rating } = this.state;
    const updatedBookmark = {
      id,
      title,
      url,
      description,
      rating,
    };
    this.setState({ error: null });
    fetch(`${config.API_ENDPOINT}/${this.props.match.params.id}`, {
      method: 'PATCH',
      body: JSON.stringify(updatedBookmark),
      headers: {
        'content-type': 'application/json',
        authorization: `bearer ${config.API_KEY}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          // get the error message from the response,
          return res.json().then((error) => {
            // then throw it
            throw error;
          });
        }
      })
      .then((data) => {
        this.props.history.push('/');
        this.context.updateBookmark(updatedBookmark);
      })
      .catch((error) => {
        console.log(error);
        this.setState({ error });
      });
  };

  handleChange = (event) => {
    const targetField = event.target.id;
    const targetValue = event.target.value;

    this.setState({
      [targetField]: targetValue,
    });
  };

  handleClickCancel = () => {
    this.props.history.push('/');
  };

  render() {
    const { error } = this.state;
    return (
      <section className="EditBookmark">
        <h2>Edit bookmark</h2>
        <form className="EditBookmark__form" onSubmit={this.handleSubmit}>
          <div className="EditBookmark__error" role="alert">
            {error && <p>{error.message}</p>}
          </div>
          <div>
            <label htmlFor="title">
              Title <Required />
            </label>
            <input
              type="text"
              name="title"
              id="title"
              value={this.state.title}
              onChange={this.handleChange}
              placeholder="Great website!"
              required
            />
          </div>
          <div>
            <label htmlFor="url">
              URL <Required />
            </label>
            <input
              type="url"
              name="url"
              id="url"
              value={this.state.url}
              onChange={this.handleChange}
              placeholder="https://www.great-website.com/"
              required
            />
          </div>
          <div>
            <label htmlFor="description">Description</label>
            <textarea
              name="description"
              id="description"
              value={this.state.description}
              onChange={this.handleChange}
            />
          </div>
          <div>
            <label htmlFor="rating">
              Rating <Required />
            </label>
            <input
              type="number"
              name="rating"
              id="rating"
              value={this.state.rating}
              onChange={this.handleChange}
              min="1"
              max="5"
              required
            />
          </div>
          <div className="EditBookmark__buttons">
            <button type="button" onClick={this.handleClickCancel}>
              Cancel
            </button>{' '}
            <button type="submit">Save</button>
          </div>
        </form>
      </section>
    );
  }
}

export default EditBookmark;
