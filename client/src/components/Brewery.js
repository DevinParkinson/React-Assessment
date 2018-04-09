import React from 'react';
import {Segment, Header, Image, Container, Grid, Divider, Button} from 'semantic-ui-react';
import axios from 'axios';
import styled from 'styled-components';
import {Link} from 'react-router-dom'


class Brewery extends React.Component {
  state = {brewery: {}}

  componentDidMount() {
    const {name} = this.props.match.params
    axios.get(`/api/brewery/${name}`)
      .then(res => {
        this.setState({brewery: res.data.entries[0]})
      })
  }

  getImage = () => {
    const {brewery} = this.state
    return (
      <Image src={brewery.images.large} />
    )
  }

  render() {
    const {brewery} = this.state
    return (
      <Grid centered columns={2}>
        <Grid.Column centered>
          <Segment inverted>
            {brewery.images ? this.getImage() : <Image src={defaultImage} />}
            <Divider hidden />
            <Container fluid>
              {/* TODO: Add the rest of the brewery details here */}
              <Header style={styles.header} as='h1'>{brewery.name}</Header>
              {brewery.established ?
                <Header style={styles.subHeader} as='h4'>Established in {brewery.established}</Header>
                :
                null
              }
              <a href={brewery.website}>
                Checkout {brewery.name}s Website
              </a>
              <p>{brewery.description}</p>
            </Container>
          </Segment>
          <Link to={'/content'}>
            <Button inverted>
              Back
              </Button>
          </Link>
          <Link to={'/breweries'}>
            <Button inverted>
              All Breweries
              </Button>
          </Link>
        </Grid.Column>
      </Grid>
    )
  }
}
const styles = {
  header: {
    color: 'white'
  },
  subHeader: {
    color: 'lightgray'
  }
}
const defaultImage = 'http://pickledwig.com/wp-content/themes/directorypress/thumbs/na.gif'

export default Brewery
