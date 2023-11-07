const valids = {
  accepted: ':attribute must be accepted.',
  after: ':attribute must be after :after.',
  after_or_equal: ':attribute must be equal or after :after_or_equal.',
  alpha: ':attribute must contain only alphabetic characters.',
  alpha_dash: ':attribute may only contain alpha-numeric characters, as well as dashes and underscores.',
  alpha_num: ':attribute must be alphanumeric.',
  before: ':attribute must be before :before.',
  before_or_equal: ':attribute must be equal or before :before_or_equal.',
  between: ':attribute must be between :min and :max.',
  confirmed: ':attribute confirmation does not match.',
  email: ':attribute format is invalid.',
  date: ':attribute is not a valid date format.',
  def: ':attribute attribute has errors.',
  digits: ':attribute must be :digits digits.',
  digits_between: ':attribute must be between :min and :max digits.',
  different: ':attribute and :different must be different.',
  in: 'selected :attribute is invalid.',
  integer: ':attribute must be an integer.',
  hex: ':attribute should have hexadecimal format',
  min: {
    numeric: ':attribute must be at least :min.',
    string: ':attribute must be at least :min characters.'
  },
  max: {
    numeric: ':attribute may not be greater than :max.',
    string: ':attribute may not be greater than :max characters.'
  },
  not_in: 'selected :attribute is invalid.',
  numeric: ':attribute must be a number.',
  present: ':attribute must be present (but can be empty).',
  required: ':attribute is required.',
  required_if: ':attribute is required when :other is :value.',
  required_unless: ':attribute is required when :other is not :value.',
  required_with: ':attribute is required when :is not empty.',
  required_with_all: ':attribute is required when :fields are not empty.',
  required_without: ':attribute is required when :is empty.',
  required_without_all: ':attribute is required when :fields are empty.',
  same: ':attribute and :same fields must match.',
  size: {
    numeric: ':attribute must be :size.',
    string: ':attribute must be :size characters.'
  },
  string: ':attribute must be a string.',
  url: ':attribute format is invalid.',
  regex: ':attribute format is invalid.',
  attributes: {},
};

// for(var i in valids){
//   valids[i] = (valids[i]).replace(":attribute", "");
// }

module.exports = valids;