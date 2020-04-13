interface Edition {
  id?: string,
  key?: string,
  name?: string,
  type: string,
  state?: string,
  startAt?: number,
  endAt?: number,
  modules: any[],
}

let gioCoreBenefitModules = [];

export function initializeModuleBenefitAuth(edition: Edition) {
  const oriModules = gioCoreBenefitModules;
  const modules = edition.modules.reduce((m, module) => {
    m = m.concat(module.children.map((c) => {
      return {...c, ...{type: edition.type}};
    }));
    return m;
  }, []);
  if (edition.type === 'project_management' || edition.type === 'organization_management') {
    gioCoreBenefitModules = oriModules.filter((module) => module.type !== edition.type).concat(modules);
  } else {
    gioCoreBenefitModules = oriModules.filter((module) => module.type === 'project_management' || module.type === 'organization_management').concat(modules);
  }
}

export function moduleBenefitAuthCheck(key) {
  return gioCoreBenefitModules.map((m) => m.key).indexOf(key) > -1;
}
