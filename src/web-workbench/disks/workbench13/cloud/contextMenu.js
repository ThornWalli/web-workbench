import { CONFIG_NAMES } from '../index';
import WbCloudInfo from '@/components/disks/workbench13/cloud/Info';
import WbCloudConnect from '@/components/disks/workbench13/cloud/Connect';
import WbCloudLogin from '@/components/disks/workbench13/cloud/Login';

export default ({ core, model }) => {
  return [
    {
      title: 'Cloud',
      items: [
        {
          title: 'Connect with…',
          action: connectWithAction(core, model)
        },
        {
          title: 'Login with…',
          action: loginWithAction(core, model)
        },
        { separator: true },
        {
          hotKey: 'I',
          keyCode: 73,
          title: 'Info',
          action: infoAction(core, model)
        }
      ]
    }
  ];
};

function infoAction (core) {
  return () => {
    core.modules.windows.addWindow({
      title: 'Info',
      component: WbCloudInfo,
      componentData: {},
      options: {
        scale: false,
        prompt: false,
        scrollX: false,
        scrollY: false
      }
    });
  };
}

function loginWithAction (core, model) {
  return () => {
    const window = core.modules.windows.addWindow({
      title: 'Login with',
      component: WbCloudLogin,
      componentData: {
        items: model.items
      },
      options: {
        scale: false,
        prompt: false,
        scrollX: false,
        scrollY: false
      }
    });

    return new Promise((resolve) => {
      window.events.subscribe(async ({ name, value }) => {
        if (name === 'close') {
          if (value) {
            const { email, password, storage } = value;
            try {
              await model.actions.login(email, password, storage);
            } catch (error) {
              debugger;
              alert(error);
            }
          }
          resolve();
        }
      });
    });
  };
};

function connectWithAction (core, model) {
  return () => {
    const window = core.modules.windows.addWindow({
      title: 'Connect with',
      component: WbCloudConnect,
      componentData: {
        model: {
          id: null,
          apiKey: null,
          url: null
        }
      },
      options: {
        scale: false,
        prompt: false,
        scrollX: false,
        scrollY: false
      }
    });

    return new Promise((resolve) => {
      window.events.subscribe(async ({ name, value }) => {
        if (name === 'close') {
          if (value) {
            const { id, url, apiKey } = value;
            await model.actions.connect(id, apiKey, url);
          }
          resolve();
        }
      });
    });
  };
};
