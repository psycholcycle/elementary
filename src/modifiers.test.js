import bootsrap from './styles';

const fakeApplier = (rules, props) =>
  Object.values(rules).reduce((acc, rule) => ({ ...acc, ...rule(props) }), {});

const fakeTheme = {
  someVariants: {
    alert: {
      color: 'red',
      margin: '300px',
    },
  },
  someName: {
    margin: '122px',
    padding: '30px',
  },
  mixins: {
    cRed: {
      color: 'red',
    },
    cBlue: {
      color: 'blue',
    },
  },
};

describe('Test modifiers', () => {
  test('variant works fine', () => {
    const [rules] = bootsrap(['margin'], { variant: 'someVariants' });
    expect(fakeApplier(rules, { theme: fakeTheme, variant: 'alert' })).toStrictEqual({
      margin: '300px',
      color: 'red',
    });
    expect(fakeApplier(rules, { m: 3, theme: fakeTheme, variant: 'alert' })).toStrictEqual({
      margin: '16px',
      color: 'red',
    });
    expect(fakeApplier(rules, { theme: fakeTheme })).toStrictEqual({});
  });
  test('themed works fine', () => {
    const [rules] = bootsrap(['margin'], { name: 'someName' });
    expect(fakeApplier(rules, { m: 3, theme: fakeTheme })).toStrictEqual({
      margin: '16px',
      padding: '30px',
    });
    expect(fakeApplier(rules, { theme: fakeTheme })).toStrictEqual({
      margin: '122px',
      padding: '30px',
    });
  });
  test('mixins works fine', () => {
    const [rules] = bootsrap(['margin']);
    expect(fakeApplier(rules, { m: 3, theme: fakeTheme, cRed: true })).toStrictEqual({
      margin: '16px',
      color: 'red',
    });
    expect(fakeApplier(rules, { m: 3, theme: fakeTheme, cBlue: true })).toStrictEqual({
      margin: '16px',
      color: 'blue',
    });
    expect(fakeApplier(rules, { m: 3, theme: fakeTheme, cBlueFake: true })).toStrictEqual({
      margin: '16px',
    });
  });
  test('actual priority', () => {
    const [rules] = bootsrap(['margin'], { name: 'someName', variant: 'someVariants' });
    expect(
      fakeApplier(rules, { m: 3, theme: fakeTheme, variant: 'alert', cBlue: true }),
    ).toStrictEqual({
      margin: '16px',
      padding: '30px',
      color: 'blue',
    });
    expect(fakeApplier(rules, { m: 3, theme: fakeTheme, variant: 'alert' })).toStrictEqual({
      margin: '16px',
      padding: '30px',
      color: 'red',
    });
    expect(fakeApplier(rules, { theme: fakeTheme, variant: 'alert' })).toStrictEqual({
      margin: '300px',
      padding: '30px',
      color: 'red',
    });
    expect(fakeApplier(rules, { theme: fakeTheme })).toStrictEqual({
      margin: '122px',
      padding: '30px',
    });
  });
});
