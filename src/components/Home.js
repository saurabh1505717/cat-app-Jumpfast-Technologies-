import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, Card, CardMedia, CardContent } from '@mui/material';

const Home = () => {
    const [catData, setCatData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('https://api.thecatapi.com/v1/images/search?has_breeds=1');
                const cat = response.data[0];
                if (cat) {
                    const breedResponse = await axios.get(`https://api.thecatapi.com/v1/images/${cat.id}`);
                    const breedData = breedResponse.data;

                    const additionalBreedResponse = await axios.get(`https://api.thecatapi.com/v1/breeds/${breedData.breeds[0].id}`);
                    const additionalBreedData = additionalBreedResponse.data;

                    const fullCatData = {
                        ...breedData,
                        ...additionalBreedData
                    };

                    setCatData(fullCatData);
                }
            } catch (error) {
                console.error('Error fetching cat data:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <Container maxWidth="sm" className="home-container">
            {catData && (
                <>
                    <Typography variant="h4" gutterBottom style={{ marginTop: '50px' }}>
                        Breed:
                        {catData.breeds && catData.breeds.length > 0 ? ""+catData.breeds[0].name : 'Unknown Breed'}
                        {catData.origin && (
                            <>
                                {catData.origin === 'Domestic' ? ' (Domestic)' : ` (${catData.origin})`}
                            </>
                        )}
                    </Typography>
                    <hr/>
                    <Card>
                        <CardMedia
                            component="img"
                            height="400"
                            image={catData.url}
                            alt="Random Cat"
                        />
                        <CardContent>
                            <Typography variant="h6" component="div">
                                About 
                                {catData.breeds && catData.breeds.length > 0 ? "  "+catData.breeds[0].name : 'Unknown Breed'}
                            </Typography>
                            <hr />
                            <Typography variant="body1" color="text.secondary">
                                {catData.breeds && catData.breeds.length > 0 ? catData.breeds[0].description : 'No description available'}
                            </Typography>
                            <hr />
                            <Typography variant="body1" color="text.secondary">
                                <h4>Lifespan: {catData.life_span} + "years"</h4>
                            </Typography>
                        </CardContent>
                    </Card>
                </>
            )}
        </Container>
    );
};

export default Home;
