import React from 'react';
import ReactDOM from 'react-dom';
import {server} from './shared'
const images = require.context('../public/img/icon', true);

export { SettingsButton, SettingsProperties, ClockSettings, VerseSettings, WeatherSettings, PhotosSettings }

class ClockSettings {
    constructor (isEnabled) {
        this.isEnabled = isEnabled
    }
}

class VerseSettings  {
    constructor (isEnabled) {
        this.isEnabled = isEnabled
    }
}

class WeatherSettings {
    constructor (isEnabled, zip, apiKey) {
        this.isEnabled = isEnabled
        this.zip = zip
        this.apiKey = apiKey
    }
}

class PhotosSettings {
    constructor (isEnabled, albumList, apiKey, apiSecret, apiUser, albumSet) {
        this.isEnabled = isEnabled
        this.albumSet = albumList
        this.apiKey = apiKey
        this.apiSecret = apiSecret
        this.apiUser = apiUser
        this.albumSet = albumSet
    }
}

class SettingsProperties {
    constructor (clockSettings, photosSettings, verseSettings, weatherSettings) {
        this.clock = clockSettings
        this.photos = photosSettings
        this.verse = verseSettings
        this.weather = weatherSettings
    }
}

class ModalProperties {
    constructor(settingsProperties, isOpen, closeCallback, updateCallback) {
        this.settingsProperties = settingsProperties
        this.isOpen = isOpen
        this.closeCallback = closeCallback
        this.updateCallback = updateCallback
    }
}

// TODO rename settings" and treat contents as "SettingsButton" and "SettingsModal"
class SettingsButton extends React.Component {
    getModalProps() {
        return new ModalProperties(this.props.settings, this.state.isOpen, this.closeModal, this.props.updateCallback)
    }

    constructor(props) {
        super(props)

        this.state = {
            isOpen: props.isOpen
        }
    }

    render() {
        let modal = new SettingsModal(this.getModalProps())
        return(
            <div id="settingsButton"  >
                <div id="buttonElement" class="button" onClick={this.openModal}>
                    <img src={images('./settings.svg') }/>
                    <div className="header">Settings</div>                
                </div>
                {modal.render()}
            </div>
        );
    }

    openModal = () => {
        this.setState({
            isOpen: true
        });
    }

    closeModal = () => {
        this.setState({
            isOpen: false
        })
    }
}

class SettingsModal extends React.Component {
    constructor(props) {
        super(props)
        
        this.state = props.settingsProperties
    }

    render() {
        if (!this.props.isOpen) {
            return null
        }

        return(
            <div id="settingsModal">

                <div class="modalContent">
                    {/* Clock Settings */}
                    <div class="extensionWrapper">
                        <div class="extensionHeader">Clock Settings</div>
                        <div class="extensionContentWrapper">
                            <label>
                                <div class="right-align">Feature Enabled</div>
                                <div class="left-align"><input type="checkbox"  defaultChecked={this.props.settingsProperties.clock.isEnabled} ref={(input) => this.clockIsEnabled = input} /></div>
                            </label>
                        </div>
                    </div> 

                    <div class="extensionWrapper">
                        <div class="extensionHeader">Verse Settings</div>
                        <div class="extensionContentWrapper">
                            <label>
                                <div class="right-align">Feature Enabled</div>
                                <div class="left-align"><input type="checkbox"  defaultChecked={this.props.settingsProperties.verse.isEnabled} ref={(input) => this.verseIsEnabled = input} /></div>
                            </label>
                        </div>
                    </div> 

                    <div class="extensionWrapper">
                        <div class="extensionHeader">Weather Settings</div>
                        <div class="extensionContentWrapper">
                            <label>
                                <div class="right-align">Feature Enabled</div>
                                <div class="left-align"><input type="checkbox" defaultChecked={this.props.settingsProperties.weather.isEnabled} ref={(input) => this.weatherIsEnabled = input} /></div>
                            </label>
                            <label>
                                <div class="right-align">Zip Code</div>
                                <div class="left-align"><input  type="number" defaultValue={this.props.settingsProperties.weather.zip}  ref={(input) => this.weatherZip = input}  /></div>
                            </label>
                            <label>
                                <div class="right-align">Weather Map API Key</div>
                                <div class="left-align"><input defaultValue={this.props.settingsProperties.weather.apiKey}  ref={(input) => this.weatherAPIKey = input}  /></div>
                            </label>
                        </div>
                    </div> 
                    <div class="extensionWrapper">
                        <div class="extensionHeader">Photos Settings</div>
                        <div class="extensionContentWrapper">
                            <label>
                                <div class="right-align">Feature Enabled</div>
                                <div class="left-align"><input type="checkbox" defaultChecked={this.props.settingsProperties.photos.isEnabled} ref={(input) => this.photosIsEnabled = input} /></div>
                            </label>
                            <label>
                                <div class="right-align">Flickr API Key</div>
                                <div class="left-align"><input defaultValue={this.props.settingsProperties.photos.apiKey}  ref={(input) => this.photosAPIKey = input}  /></div>
                            </label>
                            <label>
                                <div class="right-align">Flickr Secret API Key</div>
                                <div class="left-align"><input defaultValue={this.props.settingsProperties.photos.apiSecret}  ref={(input) => this.photosAPISecret = input}  /></div>
                            </label>
                            <label>
                                <div class="right-align">Flickr Account ID</div>
                                <div class="left-align"><input defaultValue={this.props.settingsProperties.photos.apiUser}  ref={(input) => this.photosAPIUser = input}  /></div>
                            </label>
                            <div class="extensionSubheader">
                                Displayed Albums
                            </div>
                            {this.getAlbumSettingsComponents()}

                        </div>
                    </div> 
                    {/* Any future extension should be added here, mimicking the format from above */}
                </div>


                <div class="buttonWrapper">
                    <div class ="button denial big" onClick={this.props.closeCallback}>
                        <div className="header">Cancel</div>               
                    </div>
                    <div class ="button approval big" onClick={this.saveSettings}>
                        <div className="header">Save</div>               
                    </div>
                </div>

            </div>
        );
    }

    getAlbumSettingsComponents() {
        let components = []
        this.props.settingsProperties.photos.albumSet.albums.forEach(album => {
            components.push(
                <label>
                    <div class="right-align">{album.name}</div>
                    <div class="left-align"><input type="checkbox" defaultChecked={album.isEnabled}  ref={(input) => this["album_" + album.id] = input}  /></div>
                </label>
            )
        });
        return components
    }

    saveSettings = () => {
        // Any future settings should be added to this JSON payload
        // the JSON class properties should match that found in /server/extensions.py and the settings.json file

        // Albums can be set to enabled or disabled, but are not added
        // So iterate over what we have currently, and set according to the user-inputted settings
        let newAlbumSet = this.props.settingsProperties.photos.albumSet
        newAlbumSet.albums.forEach(album => {
            let albumEnabledElement = this["album_" + album.id]
            if (albumEnabledElement != undefined) {
                album.isEnabled = albumEnabledElement.checked
            }
        });

        let settings = {
            Clock: {
                isEnabled: this.clockIsEnabled.checked
            },
            Verse: {
                isEnabled: this.verseIsEnabled.checked
            },
            Weather: {
                isEnabled: this.weatherIsEnabled.checked,
                zip: this.weatherZip.value,
                apiKey: this.weatherAPIKey.value
            },
            Photos: {
                isEnabled: this.photosIsEnabled.checked,
                apiKey: this.photosAPIKey.value,
                apiSecret: this.photosAPISecret.value,
                apiUser: this.photosAPIUser.value,
                albumSet: newAlbumSet
            }
        }
        // TODO ADD SUPPORT FOR ALBUMS
        fetch(server + 'settings/', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(settings)
        })
        .then(res => res.json()) 
        .then(
            (result) => {
                this.props.updateCallback(result)
                this.props.closeCallback()
             },
             (error) => {
                 console.log(error)
             }
         )
    }
}