const templates = [
  { label: 'the + Noun + of', regex: '\\bthe\\b\\s+\\b\\w+(_NN|_NNS|_NNP)\\b\\s+\\bof\\b' },
  { label: 'not only X but also Y', regex: 'not\\s+only\\s+.+?\\s+but\\s+also\\s+.+?' },
  { label: 'either X or Y', regex: 'either\\s+.+?\\s+or\\s+.+?' },
  { label: 'X instead of Y', regex: '.+?\\s+instead\\s+of\\s+.+?' },
  { label: 'both X and Y', regex: 'both\\s+.+?\\s+and\\s+.+?' },
  { label: 'as well as', regex: '.+?\\s+as\\s+well\\s+as\\s+.+?' },
  { label: 'such as', regex: 'such\\s+as\\s+.+?' },
  { label: 'more ... than', regex: 'more\\s+.+?\\s+than\\s+.+?' },
  { label: 'less ... than', regex: 'less\\s+.+?\\s+than\\s+.+?' },
  { label: 'either ... or ...', regex: 'either\\s+.+?\\s+or\\s+.+?' },
  { label: 'neither ... nor ...', regex: 'neither\\s+.+?\\s+nor\\s+.+?' },
  { label: 'if ... then ...', regex: 'if\\s+.+?\\s+then\\s+.+?' },
  { label: 'whether ... or ...', regex: 'whether\\s+.+?\\s+or\\s+.+?' },
  { label: 'the ... that', regex: '\\bthe\\b\\s+.+?\\s+that\\b' },
  { label: 'so ... that ...', regex: 'so\\s+.+?\\s+that\\s+.+?' },
  { label: 'too ... to ...', regex: 'too\\s+.+?\\s+to\\s+.+?' },
  { label: 'enough ... to ...', regex: '.+?\\s+enough\\s+.+?\\s+to\\s+.+?' },
  { label: 'as ... as ...', regex: 'as\\s+.+?\\s+as\\s+.+?' },
  { label: 'such ... that ...', regex: 'such\\s+.+?\\s+that\\s+.+?' },
  { label: 'the ... of the ...', regex: '\\bthe\\b\\s+.+?\\s+of\\s+\\bthe\\b\\s+.+?' },
];

export default templates;
