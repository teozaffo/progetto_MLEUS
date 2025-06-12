from sklearn.preprocessing import MinMaxScaler, StandardScaler, PowerTransformer, MaxAbsScaler, RobustScaler, Normalizer

from sklearn.base import BaseEstimator, TransformerMixin

class FlexibleScaler(BaseEstimator, TransformerMixin):
    def __init__(self, scaler=None):
        self.scaler = scaler
        self.check = False


    def __assign_scaler(self):
        if self.scaler == 'min-max':
            self.method = MinMaxScaler()
        elif self.scaler == 'standard':
            self.method = StandardScaler()
        elif self.scaler == 'yeo-johnson':
            self.method = PowerTransformer(method='yeo-johnson')
        elif self.scaler == 'box-cox':
            self.method = PowerTransformer(method='box-cox')
        elif self.scaler == 'max-abs':
            self.method = MaxAbsScaler()
        elif self.scaler == 'robust':
            self.method = RobustScaler()
        elif self.scaler == 'normalize':
            self.method = Normalizer()
        else:
            self.method = None
        self.check = True

    def fit_transform(self, X, y=None, **fit_params):
        if not self.check:
            self.__assign_scaler()
        if self.method is None:
            return X
        return self.method.fit_transform(X, y, **fit_params)

    def fit(self, X):
        if not self.check:
            self.__assign_scaler()
        if self.method is None:
            return X
        self.method.fit(X)

    def transform(self, X):
        if not self.check:
            self.__assign_scaler()
        if self.method is None:
            return X
        return self.method.transform(X)
