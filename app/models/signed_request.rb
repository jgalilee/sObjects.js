require "openssl"
require "base64"

class SignedRequest

  # Construct a SignedRequest based on the stringified version of it.
  def initialize(consumerSecret, signedRequest)
    @consumerSecret = consumerSecret
    @signedRequest = signedRequest
  end

  # Validates the signed request by verifying the key, then returns
  # the json string.
  def unsign()

    # Validate secret and signed request string.
    raise "Consumer secret not set." if @consumerSecret.blank?()
    raise "Signed request not set." if @signedRequest.blank?()

    # 1) Split the signed request into signature and payload.
    array = @signedRequest.split('.')
    raise "Incorrectly formatted signed request." if array.length != 2
    signature = array[0]
    payload = array[1]

    # 2) Verify the contents of the payload by first validating the authenticity
    #    of the signature.
    decodedSignature = Base64.decode64(signature)
    digest = OpenSSL::Digest::Digest.new("sha256")
    hmac = OpenSSL::HMAC.digest(digest, @consumerSecret, payload)
    raise "Signed request has been tampered with." if decodedSignature != hmac

    # 3) Decode the base64 encoded payload of the canvas request.
    jsonString = Base64.decode64(payload)
    return jsonString

  end
end