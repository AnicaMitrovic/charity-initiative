import React, { Component } from 'react';
import factory from '../ethereum/factory';
import {Card } from 'semantic-ui-react';
import Layout from '../components/Layout';
import { Link } from '../routes';
import Initiative from '../ethereum/initiative';

class InitiativeList extends Component {
    static async getInitialProps(){  //Next requires this method, it wants to retrieve initial data without rendering component
        const initiatives = await factory.methods.getDeployedAddress().call();
        const listLength = await factory.methods.getStringsLength().call();
        const titles = [];

        for (let i=0; i< listLength; i++) {
            
            const title = await factory.methods.getStringByIndex(i).call();
            titles.push(title);
        }
        return { initiatives, titles };
    }

    renderInitiatives(){
        let i = 0;
        const items = this.props.initiatives.map(address => {
            return {
                header: this.props.titles[i++], 
                description: (
                    <Link route={`/initiatives/${address}`}>
                        <a>{address}</a>
                    </Link>
                ),
                fluid: true
            }
        });
        return <Card.Group centered items={items} />;
    }

  render() {
    return (
      <Layout>
            <div>
                <h3 style={{ marginBottom: '2em', marginTop: '2em'}}>Choose Charity Initiative to Donate</h3>
                {this.renderInitiatives()}
                <br></br>
            </div> 
      </Layout>
     
    );
  }
}

export default InitiativeList;