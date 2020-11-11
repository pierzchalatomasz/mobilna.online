import { h, Component, render } from 'https://unpkg.com/preact?module';
import htm from 'https://unpkg.com/htm?module';

const html = htm.bind(h);

const emailEndpoint = 'https://sls-weur-dev-api-mobilna-online.azurewebsites.net/api/email';
const API_STATE = {
  INITIAL: 'INITIAL',
  LOADING: 'LOADING',
  ERROR: 'ERROR',
  SUCCESS: 'SUCCESS',
};

class ContactForm extends Component {
  state = {
    name: '',
    email: '',
    message: '',
    apiState: API_STATE.INITIAL,
  }

  onFieldChange = fieldName => e => {
    this.setState({
      [fieldName]: e.target.value,
    });
  }

  submit = (e) => {
    e.preventDefault();
    console.log('submit');

    const { name, email, message } = this.state;

    this.setState({ apiState: API_STATE.LOADING });

    window.grecaptcha.ready(() => {
      window.grecaptcha.execute('6Ld5UOEZAAAAAGbMWH4Mz4DfCO_H2jrS2HnVg2u6', {action: 'submit'}).then((token) => {
        console.log(token);

        return fetch(emailEndpoint, {
          method: 'POST',
          body: JSON.stringify({
            name,
            email,
            content: message,
            captcha: token,
          }),
        })
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('api error');
        }

        return response.text();
      })
      .then(() => {
        this.setState({ apiState: API_STATE.SUCCESS });
      })
      .catch((error) => {
        console.error(error);
        this.setState({ apiState: API_STATE.ERROR });
      });
    });
  }

  render() {
    const { name, email, message, apiState } = this.state;
    const isValid = !!name && !!email && !!message;;

    console.log(this.state);

    if (apiState === API_STATE.LOADING) {
      return html`
        <div>Wysyłanie...</div>
      `;
    }

    if (apiState === API_STATE.ERROR) {
      return html`
        <div>Nie udało się wysłać wiadomości!</div>
      `;
    }

    if (apiState === API_STATE.SUCCESS) {
      return html`
        <div>Wiadomość wysłana pomyślnie!</div>
      `;
    }

    return html`
      <form id="contact" action="" method="post" onSubmit=${this.submit}>
        <div class="row">
          <div class="col-md-6 col-sm-12">
            <fieldset>
              <input name="name" type="text" id="name" placeholder="Imię i Nazwisko*" required=""
                style="background-color: rgba(250,250,250,0.3);"
                onInput=${this.onFieldChange('name')}
                value=${name}
              />
            </fieldset>
          </div>
          <div class="col-md-6 col-sm-12">
            <fieldset>
              <input name="email" type="text" id="email" placeholder="E-Mail*"
                required="" style="background-color: rgba(250,250,250,0.3);"
                onInput=${this.onFieldChange('email')}
                value=${email}
              />
            </fieldset>
          </div>
          <div class="col-lg-12">
            <div class="textarea-wrapper">
              <fieldset>
                <textarea name="message" rows="6" id="message" placeholder="Wiadomość*"
                  required="" style="background-color: rgba(250,250,250,0.3);"
                  onInput=${this.onFieldChange('message')}
                  value=${message}
                ></textarea>
              </fieldset>
              <p class="explanation">* pola wymagane</p>
            </div>
          </div>
          <div class="col-lg-12">
            <fieldset>
              <button type="submit" id="form-submit" class="main-button" disabled=${!isValid}>
                Wyślij Wiadomość
              </button>
            </fieldset>
          </div>
        </div>
      </form>
    `;
  }
}

const mountingPoint = document.getElementById('contact-form');

render(html`<${ContactForm} />`, mountingPoint);
