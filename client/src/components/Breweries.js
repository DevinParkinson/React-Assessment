import React from 'react';
import axios from 'axios';
import InfiniteScroll from 'react-infinite-scroller';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import {setFlash} from '../actions/flash';
import {
  Button,
  Card,
  Container,
  Dimmer,
  Header,
  Item,
  Loader,
  Segment,
  Image,
} from 'semantic-ui-react';

const defaultImage = 'http://d1marr3m5x4iac.cloudfront.net/images/edpborder500/I0-001/010/265/138-1.jpeg_/soda-bar-38.jpeg'


class Breweries extends React.Component {
  state = {breweries: [], loading: true, page: 1, hasMore: true}

  componentDidMount() {
    this.fetchbreweries(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({breweries: [], loading: true, hasMore: true, page: 1});
    this.fetchbreweries(nextProps, 1);
  }

  fetchbreweries = (props, page = 1) => {
    const {dispatch} = this.props;
    axios.get(`/api/all_breweries?page=${page}&per_page=10`)
      .then(res => {
        const {data} = res;
        console.log(data);
        if (data.total_pages) {
          if (data.total_pages === page)
            this.setState({hasMore: false});
          this.setState({breweries: [...this.state.breweries, ...data.entries], total_pages: data.total_pages, page})
        } else {
          this.setState({breweries: data.entries, hasMore: false})
        }
      })
      .catch(err => {
        dispatch(setFlash('Unable to retrieve breweries. Please try again', 'red'))
      })
      .then(() => {
        this.setState({loading: false});
      });
  }

  loadingMessage = () => {
    return (
      <Dimmer active style={{height: '100vh'}}>
        <Loader>Loading</Loader>
      </Dimmer>
    );
  }

  loadMorebreweries = () => {
    this.fetchbreweries(this.props, this.state.page + 1)
  }

  showImage = (brewery) => {
    return (
      <Image size='large' src={brewery.images.large} />
    )
  }

  displaybreweries = () => {
    const {breweries} = this.state;
    return breweries.map(brewery => {
      return (
        <Card key={brewery.name}>
          <Card.Content>
            {brewery.images ? this.showImage(brewery) : <Image src={defaultImage} />}
            <Card.Header>{brewery.name}</Card.Header>
          </Card.Content>
          <Card.Content extra>
            <Link to={`/breweries/${brewery.name}`}>
              View
            </Link>
          </Card.Content>
        </Card>
      );
    });
  }

  render() {
    const {page, hasMore, loading} = this.state;
    if (loading) {
      return (
        <Container>
          {this.loadingMessage()}
        </Container>
      )
    } else {
      return (
        <Segment inverted >
          <Header as='h1' textAlign='center' inverted>Breweries</Header>
          <Container style={{height: '100vh', overflowY: 'scroll', overflowX: 'hidden'}}>
            <InfiniteScroll
              pageStart={page}
              loadMore={this.loadMorebreweries}
              hasMore={hasMore}
              useWindow={false}
            >
              <Card.Group stackable itemsPerRow={5}>
                {this.displaybreweries()}
              </Card.Group>
            </InfiniteScroll>
          </Container>
        </Segment>
      );
    }
  }

}


export default connect()(Breweries);
