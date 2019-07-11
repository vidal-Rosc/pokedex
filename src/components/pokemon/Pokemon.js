import React, { Component } from 'react';
import axios from 'axios';

const type_colors = {
    normal: 'B7B7A8',
    poison: 'A85A9F',
    psychic: 'F562B3',
    grass: '8CD74F',
    ground: 'EACA53',
    ice: '97F2FF',
    fire: 'FA5541',
    rock: 'CBBB6F',
    dragon: '8974FF',
    water: '55AFFF',
    bug: 'C4D319',
    dark: '8D6753',
    fighting: 'AA5643',
    ghost: '7571D3',
    steel: 'C5C4DC',
    fliying: '78A4FF',
    electric: 'FDE338',
    fairy: 'F9AFFF'
};

class Pokemon extends Component {
    state={
        name: '',
        pokemonIndex: '',
        imageUrl: '',
        types: [],
        description: '',
        stats: {
            hp: "",
            attack: "",
            defense: "",
            speed: "",
            specialAttack: "",
            specialDefense: ""
        },
        height: '',
        weight: '',
        eggGroup: '',
        abilities: '',
        genderRatioMale: '',
        genderRatioFemale: '',
        evs: '',
        hatchSteps: ''
    };

    async componenDidMount() {
        const { pokemonIndex } = this.props.match.params;

    // Urls for pokemon information
        const pokemonUrl = `https://pokeapi.co/api/v2/pokemon/${pokemonIndex}/`;
        const pokeSpeciesUrl = `https://pokeapi.co/api/v2/pokemon-species/${pokemonIndex}/`;

    //getting the pokemon stats
        const pokemonRes = await axios.get(pokemonUrl);

        const name = pokemonRes.data.name;

        const imageUrl = pokemonRes.data.sprites.front_default;

        let { hp, attack, defense, speed, specialAttack, specialDefense } = '';

        // eslint-disable-next-line array-callback-return
        pokemonRes.data.stats.map(stat => {
            switch (stat.stat.name) {
                case 'hp':
                    hp = stat['base_stat'];
                    break;
                case 'attack':
                    attack = stat['base_stat'];
                    break;
                case 'defense':
                    defense = stat['base_stat'];
                    break;
                case 'speed':
                    speed = stat['base_stat'];
                    break;
                case 'special-attack':
                    specialAttack = stat['base_stat'];
                    break;
                case 'special-defense':
                    specialDefense = stat['base_stat'];
                    break;
                default:
                    //do nothing
            }
        });

        //convert Decimenters to Feet
        const height = Math.round((pokemonRes.data.height * 0.328084 + 0.0001) * 100) / 100;

        // ĉonvert to lbs
        const weight = Math.round((pokemonRes.data.weight * 0.220462 + 0.0001) * 100) / 100;

        const types = pokemonRes.data.types.map( type => type.type.name);

        const abilities = pokemonRes.data.abilities.map( ability => {
            return ability.ability.name
            .toLowerCase()
            .split('-')
            .map(s => s.chartAt(0).toUpperCase() + s.substring(1))
            .join(' ');
        });

    // only will pass those we declare (filter)
        const evs = pokemonRes.data.stats.filter(stat => {
            if (stat.effort > 0) {
                return true;
            }
            return false;
        })
        .map(stat => {
            return `${stat.effort} ${stat.stat.name
                .toLowerCase()
                .split('-')
                .map(s => s.charAt(0).toUpperCase() + s.substring(1))
                .join(' ')}`;
                
        })
        .join(', ')

    // getting the pokemon description, gender, catchRate, eggGroups and hatchSteps

     await axios.get(pokeSpeciesUrl).then(res => {
            let description = '';
            res.data.flavor_text_entries.some( flavor => {
                if (flavor.language.name === 'es') {
                    description = flavor.flavor_text;
                }
                return  false;
            });

            const femaleRate = res.data['gender_rate'];
            const genderRatioFemale = 12.5 * femaleRate;
            const genderRatioMale = 12.5 * (8 -femaleRate);

            const catchRate = Math.round((100 / 255) * res.data['capture_rate']);

            const eggGroup = res.data['egg_groups']
                .map( group => {
                    return group.name
                        .toLowerCase()
                        .split('-')
                        .map(s => s.chartAt(0).toUpperCase() + s.substring(1))
                        .join(' ');
                })
                .join(', ');

            const hatchSteps = 255 * (res.data['hatch_counter'] + 1);

        this.setState({
            description,
            genderRatioFemale,
            genderRatioMale,
            catchRate,
            eggGroup,
            hatchSteps
            });
        });

        this.setState({
            imageUrl,
            pokemonIndex,
            name,
            types,
            stats:{
                hp,
                attack,
                defense,
                speed,
                specialAttack,
                specialDefense
            },
            height,
            weight,
            abilities,
            evs
        });


    }

    render() {
        return (
            <div className="col">
              <div className="card">
                  <div className="card-header">
                      <div className="row">
                          <div className="col-5">
                            <h5>{this.state.pokemonIndex}</h5>
                          </div>
                          <div className="col-7">(
                            <div className="float-right">{
                                this.state.types.map(type => (
                                    <span key={type}
                                    className="badge  badge-primary badge-pill mr-1"
                                    style= {{
                                        backgroundColor: `#${type_colors[type]}`,
                                        color: "white"
                                        }}
                                    >
                                    {type
                                    .toLowerCase()
                                    .split(' ')
                                    .map(s => s.charAt(0).toUpperCase() + s.substring(1))
                                    .join(' ')}
                                    </span>
                                ))}
                            </div>
                          </div>
                      </div>
                  </div>
                  <div className="card-body">
                      <div className="row align items center">
                          <div className="col-md-3">
                              <img 
                              alt=""
                              src={this.state.imageUrl}
                              className="card-img-top rounded mx-auto mt-2"
                              />
                          </div>
                          <div className="col-md-9">
                            <h4 className="mx-auto">
                                {this.state.name
                                    .toLowerCase()
                                    .split(' ')
                                    .map(s => s.charAt(0).toUpperCase() + s.substring(1))
                                    .join(' ')}
                            </h4>
                            <div className="row align-items-center">
                                <div className="col-12 col-md-3">
                                        Hp
                                </div>
                                <div className="col-12 col-md-9">
                                    <div className="progress">
                                        <div 
                                        className="progress-bar"
                                        role="progressbar"
                                        style={{
                                            width: `${this.state.hp}%`
                                        }}
                                        aria-valuenow="25"
                                        aria-valuemin="0"
                                        aria-valuemax="100"
                                        >
                                        <small>{this.state.stats.hp}</small>

                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row align-items-center">
                                <div className="col-12 col-md-3">
                                        Attack
                                </div>
                                <div className="col-12 col-md-9">
                                    <div className="progress">
                                        <div 
                                        className="progress-bar"
                                        role="progressbar"
                                        style={{
                                            width: `${this.state.attack}%`
                                        }}
                                        aria-valuenow="25"
                                        aria-valuemin="0"
                                        aria-valuemax="100"
                                        >
                                        <small>{this.state.stats.attack}</small>

                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row align-items-center">
                                <div className="col-12 col-md-3">
                                        Defense
                                </div>
                                <div className="col-12 col-md-9">
                                    <div className="progress">
                                        <div 
                                        className="progress-bar"
                                        role="progressbar"
                                        style={{
                                            width: `${this.state.defense}%`
                                        }}
                                        aria-valuenow="25"
                                        aria-valuemin="0"
                                        aria-valuemax="100"
                                        >
                                        <small>{this.state.stats.defense}</small>

                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row align-items-center">
                                <div className="col-12 col-md-3">
                                        Special Attack
                                </div>
                                <div className="col-12 col-md-9">
                                    <div className="progress">
                                        <div 
                                        className="progress-bar"
                                        role="progressbar"
                                        style={{
                                            width: `${this.state.specialAttack}%`
                                        }}
                                        aria-valuenow="25"
                                        aria-valuemin="0"
                                        aria-valuemax="100"
                                        >
                                        <small>{this.state.stats.specialAttack}</small>

                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row align-items-center">
                                <div className="col-12 col-md-3">
                                        Special Defense
                                </div>
                                <div className="col-12 col-md-9">
                                    <div className="progress">
                                        <div 
                                        className="progress-bar"
                                        role="progressbar"
                                        style={{
                                            width: `${this.state.specialDefense}%`
                                        }}
                                        aria-valuenow="25"
                                        aria-valuemin="0"
                                        aria-valuemax="100"
                                        >
                                        <small>{this.state.stats.specialDefense}</small>

                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row align-items-center">
                                <div className="col-12 col-md-3">
                                        Speed
                                </div>
                                <div className="col-12 col-md-9">
                                    <div className="progress">
                                        <div 
                                        className="progress-bar"
                                        role="progressbar"
                                        style={{
                                            width: `${this.state.speed}%`
                                        }}
                                        aria-valuenow="25"
                                        aria-valuemin="0"
                                        aria-valuemax="100"
                                        >
                                        <small>{this.state.stats.speed}</small>

                                        </div>
                                    </div>
                                </div>
                            </div>
                          </div>
                          <div className="row mt-1">
                              <div className="col">
                                  <p className="p-2">{this.state.description}</p>
                              </div>
                          </div>
                      </div>
                  </div>
                  <hr/>
                  <div className="card-body">
                      <h5 className="card-title text-center">
                          Profile
                      </h5>
                      <div className="row">
                            <div className="col-md-6">
                                <div className="row">
                                    <div className="col-md-6">
                                        <h6 className="float-right">height:</h6>
                                    </div>
                                    <div className="col-md-6">
                                        <h6 className="float-left">{this.state.height} ft.</h6>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-6">
                                        <h6 className="float-right">Weight:</h6>
                                    </div>
                                    <div className="col-md-6">
                                        <h6 className="float-left">{this.state.weight} lbs. </h6>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-6">
                                        <h6 className="float-right">Catch Rate:</h6>
                                    </div>
                                    <div className="col-md-6">
                                        <h6 className="float-left">{this.state.catchRate}% </h6>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-6">
                                        <h6 className="float-right">Gender Ratio:</h6>
                                    </div>
                                    <div className="col-md-6">
                                        <div 
                                            className="progress-bar"
                                            role="progressbar"
                                            style={{
                                                width: `${this.state.genderRatioFemale}%`,
                                                backgroundColor: '#C2185B'
                                            }}
                                            aria-valuenow="15"
                                            aria-valuemin="0"
                                            aria-valuemax="100"
                                        >
                                        <small>{this.state.stats.genderRatioFemale}</small>
                                        </div>
                                        <div 
                                            className="progress-bar"
                                            role="progressbar"
                                            style={{
                                                width: `${this.state.genderRatioMale}%`,
                                                backgroundColor: '#1976D2'
                                            }}
                                            aria-valuenow="15"
                                            aria-valuemin="0"
                                            aria-valuemax="100"
                                        >
                                        <small>{this.state.stats.genderRatioMale}</small>
                                        </div>

                                    </div>
                                </div>
                            
                            </div> 
                            <div className="col-md-6">
                                <div className="row">
                                    <div className="col-md-6">
                                        <h6 className="float-right">Egg Groups:</h6>
                                    </div>
                                    <div className="col-md-6">
                                    <h6 className="float-left">{this.state.eggGroup}</h6>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-6">
                                        <h6 className="float-right">Hatch Steps:</h6>
                                    </div>
                                    <div className="col-md-6">
                                    <h6 className="float-left">{this.state.hatchSteps}</h6>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-6">
                                        <h6 className="float-right">Abilities:</h6>
                                    </div>
                                    <div className="col-md-6">
                                    <h6 className="float-left">{this.state.abilities}</h6>
                                    </div>  
                                </div>
                                <div className="row">
                                    <div className="col-md-6">
                                        <h6 className="float-right">EVs:</h6>
                                    </div>
                                    <div className="col-md-6">
                                    <h6 className="float-left">{this.state.evs}</h6>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                    </div>
                    <div className="card-footer text-muted">
                            Data From {' '} 
                            <a 
                            href='https://pokeapi.co/'
                            target="_blank"
                            className="card-link">
                            pokeAPI.co
                            </a>
                    </div>
                </div>
            </div>
                
        );
    }
}
export default Pokemon;