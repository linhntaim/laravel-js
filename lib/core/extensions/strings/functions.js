export function rtrim(str, chars = ' \t\n\r\0\x0B') {
    return str.replace(new RegExp(`[${chars.replaceAll('\\','\\\\')}]+$`, 'g'), '')
}

export function ltrim(str, chars = ' \t\n\r\0\x0B') {
    return str.replace(new RegExp(`^[${chars.replaceAll('\\','\\\\')}]+`), '')
}

export function trim(str, chars = ' \t\n\r\0\x0B') {
    return rtrim(ltrim(str, chars), chars)
}
