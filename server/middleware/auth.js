exports.isAuthenticated = (req, res, next) => {
  if (req.session.authenticated) {
    return next();
  }
  res.redirect('/auth/login');
};

exports.isDoctor = (req, res, next) => {
  if (req.session.role === 'doctor') {
    return next();
  }
  res.status(403).render('errors/403', { message: 'Access denied. Doctors only.' });
};

exports.isNurse = (req, res, next) => {
  if (req.session.role === 'nurse') {
    return next();
  }
  res.status(403).render('errors/403', { message: 'Access denied. Nurses only.' });
};

exports.isITManager = (req, res, next) => {
  if (req.session.role === 'it-manager') {
    return next();
  }
  res.status(403).render('errors/403', { message: 'Access denied. IT Managers only.' });
};

exports.isReceptionist = (req, res, next) => {
  if (req.session.role === 'receptionist') {
    return next();
  }
  res.status(403).render('errors/403', { message: 'Access denied. Receptionists only.' });
};
