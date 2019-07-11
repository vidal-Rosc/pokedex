import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import styled from 'styled-components';

import loading from '../assets/images/loading.gif'

//styling the pokemon sprites
const Sprite = styled.img`
    width: 5em;
    height: 5em;
    display: none;
`;

// creating a styled component for each pokemon card: box-shadows, 
const Card = styled.div`
box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
&:hover {
    box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22);
}
-moz-user-select: none;
-website-user-select: none;
user-select: none;
-o-user-select:none;
`;

const StyledLink = styled(Link)`
text-decoration: none;
color: black;
&:focus,
&:hover,
&:visited,
&:link,
&:active {
    text-decoration: none;
}
`;


class PokemonProfile extends Component {
    state = {
        name: "",
        imageUrl: "",
        PokemonIndex: "",
        imageloading: true,
        tomManyRequest: false
    };

    componentDidMount(){
        const { name, url } = this.props;
        const pokemonIndex = url.split('/')[url.split('/').length -2];
        const imageUrl = `https://github.com/PokeAPI/sprites/blob/master/sprites/pokemon/${pokemonIndex}.png?raw=true`;

        this.setState({
            name, 
            imageUrl,
            pokemonIndex
        });

    }
    render() {
        return (
            <div className="col-md-3 col-sm-6 mb-5">
                <StyledLink to={`pokemon/${this.state.pokemonIndex}`}>
                    <Card className="card">
                        <h5 className="card-header">{this.state.pokemonIndex}</h5>
                        {this.state.imageloading ? (
                            <img 
                                alt=""
                                src={ loading } 
                                style={{ width: '4em', height: '4em'}} 
                                className="card-img-top rounded mx-auto d-block mt-2"></img> 
                        ) : null }
                    <Sprite 
                            className="card-img-top rounded mx-auto mt-2"
                            onLoad={() => this.setState({ imageloading: false })}
                            onError={() => this.setState({ tomManyRequest: true })}
                            src={this.state.imageUrl}
                            style={
                                this.state.tomManyRequest 
                                ? { display: "none" } 
                                : this.state.imageloading 
                                ? null 
                                : { display: "block" }
                            }
                    />
                
                    {this.state.tomManyRequest ? (
                        <h6 className="mx-auto">
                            <span className="badge badge-danger mt-2"> To many Request</span>
                        </h6>) : null}

                    <div className="card-body mx-auto">
                        <h6 className="card-title mx-auto"> {this.state.name.toLocaleLowerCase()
                            .split(' ')
                            .map(letter => letter.charAt(0).toLocaleUpperCase() + letter.substring(1)
                            )
                            .join(' ')}
                        </h6>
                    </div>
                    
                </Card>
                </StyledLink> 
            </div>
        )
    }
}
export default PokemonProfile;