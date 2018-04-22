exports.createMidi = function createMidi ({
    uid, channel, number, min = 0, max = 127, id = '', axis = 'x'
}) {
    return channel ?
        //<midi var="y1" type="0" channel="12" data1="22" data2f="0" data2t="127" sysex=""/>
        `<midi var ="${axis}${id}" type="0" channel="${channel}" data1="${number}" data2f="${min}" data2t="${max}" sysex="" />` :
        '';

};