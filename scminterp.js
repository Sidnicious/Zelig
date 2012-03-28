evaluator = {};

evaluator.getInput = function(input) {
	
	evaluator.input = input;
	evaluator.input = evaluator.input.replace(/\(/g,  "( ");
	evaluator.input = evaluator.input.replace(/\)/g, " )");
	evaluator.input = evaluator.input.split(' ');
	evaluator.input = evaluator.prep(evaluator.input);
	evaluator.input = evaluator.makeList(evaluator.input);

};
	
evaluator.prep = function(an_array) {
	var i = 0;
	while (an_array[i] === ' ') {
		++i;
	}
	if (an_array[i] === '(') {
		var x = an_array;
		x.shift();
		return x;
	}
	else {
		return an_array;
	}
};

evaluator.makeList = function(an_array) {
		evaluator.inarray = an_array;
		var return_val = this.makeArray();
		return return_val;
	};

evaluator.makeArray = function makearray() {

				var new_array = [];
				var i = 0;
				while (evaluator.inarray[0]!==')') {
					if (evaluator.inarray[0] === '(') {
						evaluator.inarray.shift();
						new_array[i] = makearray();
						i++;
						evaluator.inarray.shift();
				   } else {
						new_array[i] = evaluator.inarray[0];
						i++;
						evaluator.inarray.shift();
				   }
				}
				return new_array;
			};
			


evaluator.getRemainder = function(an_array, pos) {
	
	var i = 0;
	var return_array = [];
	var len = an_array.length;
	pos++;

	while (pos<=len) {
		return_array[i] = an_array[pos];
		pos++;
		i++;
	}
	return return_array;
};
////
evaluator.evaluate = function evaluate(expr, env) {
	var evaluatedList;
	if (Array.isArray(expr)) {
		if (expr[0] in evaluator.SpecialForms) { 
			return evaluator.SpecialForms[expr[0]](expr, env);
		} else {
			evaluatedList = expr.map(function (expr) {
				return evaluator.evaluate(expr, env);
			}); 
			return evaluatedList[0].call(evaluatedList.slice(1));		
		}	
	} else if (evaluator.isnumber(expr)) {
		return +expr;
	} else if (expr in env) {
		return env[expr]; 
	} else {
		throw new Error("Evaluate Error"); 
	}
};

evaluator.SpecialForms = { 
	'if': function(expr, env) {
		if (evaluator.evaluate(evaluator.extractTest(expr), env)) {
			return evaluator.evaluate(evaluator.extractResult(expr), env);
		} else {
			return evaluator.evaluate(evaluator.extractElse(expr), env);
		}
	},
	'define': function (expr, env) {
	     	if (Array.isArray(expr[1])) {
				env[expr[1][0]] = new evaluator.Procedure(expr[1].slice(1), expr.slice(2), env);
		} else {
			env[expr[1]] = evaluator.evaluate(expr[2], env);
		}
	}
};
		
evaluator.isnumber = function(expr) {	
	return (typeof parseInt(expr, 10) === "number" && isFinite(expr));
};

evaluator.Procedure = function (formal_args, body, env) {
		
	this.formal_args = formal_args;
	this.body = body;
	this.env = env;
}

evaluator.Procedure.prototype.call = function(args) {
	var env = Object.create(this.env);
	for (var i = 0, l = this.formal_args.length; i<=l; i++) {
			env[this.formal_args[i]] = args[i]; 
		};
	return this.body.reduce (function (acc, expr) {
		return evaluator.evaluate(expr, env);
	}, undefined);
};
		

evaluator.NativeProcedure = function (handler) {
	this.handler = handler;
};

evaluator.NativeProcedure.prototype = new evaluator.Procedure;

evaluator.NativeProcedure.prototype.call = function(args) {
	return this.handler(args);
};


evaluator.GlobalEnv = {
	'+': new evaluator.NativeProcedure(function (args) {
		return args.reduce( function (acc, x) {
			return x + acc;
		}, 0); 
	})
};

			
