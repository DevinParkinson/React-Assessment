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

const defaultImage = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQGD2UafrBoVljJHE40XNmGcrNdVoxLPxe4ynKaSn4RNUomVuxv'


class Beers extends React.Component {
  state = {beers: [], loading: true, page: 1, hasMore: true}

  componentDidMount() {
    this.fetchBeers(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({beers: [], loading: true, hasMore: true, page: 1});
    this.fetchBeers(nextProps, 1);
  }

  fetchBeers = (props, page = 1) => {
    const {dispatch} = this.props;
    axios.get(`/api/all_beers?page=${page}&per_page=10`)
      .then(res => {
        const {data} = res;
        console.log(data);
        if (data.total_pages) {
          if (data.total_pages === page)
            this.setState({hasMore: false});
          this.setState({beers: [...this.state.beers, ...data.entries], total_pages: data.total_pages, page})
        } else {
          this.setState({beers: data.entries, hasMore: false})
        }
      })
      .catch(err => {
        dispatch(setFlash('Unable to retrieve beers. Please try again', 'red'))
      })
      .then(() => {
        this.setState({loading: false});
      });
  }

  displayBeers = () => {
    const {beers} = this.state;
    return beers.map(beer => {
      return (
        <Card key={beer.name}>
          <Card.Content>
            {beer.labels ? this.showLabel(beer) : <Image src={defaultImage} />}
            <Card.Header>{beer.name}</Card.Header>
          </Card.Content>
          <Card.Content extra>
            <Link to={`/beers/${beer.name}`}>
              View
            </Link>
          </Card.Content>
        </Card>
      );
    });
  }

  loadMoreBeers = () => {
    this.fetchBeers(this.props, this.state.page + 1)
  }

  showLabel = (beer) => {
    return (
      <Image size='large' src={beer.labels.large} />
    )
  }

  loadingMessage = () => {
    return (
      <Dimmer active style={{height: '100vh'}}>
        <Loader>Loading</Loader>
      </Dimmer>
    );
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
          <Header as='h1' textAlign='center' inverted>Beers</Header>
          <Container style={{height: '100vh', overflowY: 'scroll', overflowX: 'hidden'}}>
            <InfiniteScroll
              pageStart={page}
              loadMore={this.loadMoreBeers}
              hasMore={hasMore}
              useWindow={false}
            >
              <Card.Group stackable itemsPerRow={5}>
                {this.displayBeers()}
              </Card.Group>
            </InfiniteScroll>
          </Container>
        </Segment>
      );
    }
  }

}

export default connect()(Beers);
