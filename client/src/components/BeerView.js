import React from 'react';
import axios from 'axios';
import styled from 'styled-components';
import {Link} from 'react-router-dom'
import {
  Segment,
  Header,
  Image,
  Container,
  Grid,
  Button
} from 'semantic-ui-react';

const defaultImage = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQGD2UafrBoVljJHE40XNmGcrNdVoxLPxe4ynKaSn4RNUomVuxv'


class BeerView extends React.Component {
  state = {beer: {}}

  componentDidMount() {
    const {name} = this.props.match.params
    axios.get(`/api/beer/${name}`)
      .then(res => {
        this.setState({beer: res.data.entries[0]})
      })
  }

  getLabel = () => {
    const {beer} = this.state
    return (
      <Image src={beer.labels.large} />
    )
  }

  render() {
    const {beer} = this.state
    return (
      <Grid centered columns={3}>
        <Grid.Column centered>
          {beer.labels ? this.getLabel(beer) : <Image src={defaultImage} />}
        </Grid.Column>
        <Grid.Column>
          <Segment inverted>
            <Container fluid>
              <Header style={styles.header} as='h1'>{beer.name}</Header>
              <p>{beer.description}</p>
            </Container>
          </Segment>
          <Link to={'/beers'}>
            <Button inverted>
              Back
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


export default BeerView
