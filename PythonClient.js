var PythonClient = require('python-shell');

var arg = {
    img_path : './image_transmissions/input.png',
    mask_path : './image_transmissions/mask.png',
    out_path : './image_transmissions/outout.png'
}
function set_img_path(_imgPath){
    arg.img_path = _img_path;
}
function set_mask_path(_maskPath){
    args.mask_path = _maskPath;
}
function set_out_path(_outPath){
    args.out_path = _outPath;
}

var options = {
    mode : 'text',
    pythonPath : '',
    pythonOptions : ['-u'],
    scriptPath : '',
    args : [arg.img_path, arg.mask_path, arg.out_path]
};

PythonClient.run('./PythonClient.py', options, function (err, results) {
    if (err) throw err;
    
    console.log('results: %j', results);
  });